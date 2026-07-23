import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { authComponent } from "./auth";
import { rateLimiter } from "./rateLimit";

type DatabaseCtx = QueryCtx | MutationCtx;

async function getOwnedRoutine(ctx: DatabaseCtx, routineId: Id<"routines">, userId: string) {
	const routine = await ctx.db.get(routineId);
	if (!routine || routine.userId !== userId) {
		throw new Error("Unauthorized");
	}
	return routine;
}

async function getOwnedRoutineExercise(ctx: DatabaseCtx, routineExerciseId: Id<"routinesExercises">, userId: string) {
	const routineExercise = await ctx.db.get(routineExerciseId);
	if (!routineExercise) {
		throw new Error("Routine exercise not found");
	}
	await getOwnedRoutine(ctx, routineExercise.routineId, userId);
	return routineExercise;
}

async function assertExerciseAvailable(ctx: DatabaseCtx, exerciseId: Id<"exercises">, userId: string) {
	const exercise = await ctx.db.get(exerciseId);
	if (!exercise || (exercise.userId !== userId && exercise.userId !== "default")) {
		throw new Error("Unauthorized");
	}
}

export const getRoutineExerciseById = query({
	args: {
		routineExerciseId: v.id("routinesExercises"),
	},
	handler: async (ctx, args) => {
		let userId: string;
		try {
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return null;
			}
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return null
			console.error("Auth error in getRoutineExerciseById:", error);
			return null;
		}

		try {
			return await getOwnedRoutineExercise(ctx, args.routineExerciseId, userId);
		} catch {
			return null;
		}
	},
});

export const addRoutineExercise = mutation({
	args: {
		exerciseId: v.id("exercises"),
		routineId: v.id("routines"),
		note: v.optional(v.string()),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "addRoutineExercise", { key: userId, throws: true });
		await Promise.all([
			getOwnedRoutine(ctx, args.routineId, userId),
			assertExerciseAvailable(ctx, args.exerciseId, userId),
		]);

		await ctx.db.insert("routinesExercises", {
			exerciseId: args.exerciseId,
			routineId: args.routineId,
			note: args.note,
			order: args.order,
		});
	},
});

export const editExercise = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		exerciseId: v.id("exercises"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateRoutineExercise", { key: userId, throws: true });
		await Promise.all([
			getOwnedRoutineExercise(ctx, args.routineExerciseId, userId),
			assertExerciseAvailable(ctx, args.exerciseId, userId),
		]);

		await ctx.db.patch(args.routineExerciseId, {
			exerciseId: args.exerciseId,
		});
	},
});

export const editNote = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		note: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateRoutineExercise", { key: userId, throws: true });
		await getOwnedRoutineExercise(ctx, args.routineExerciseId, userId);

		await ctx.db.patch(args.routineExerciseId, {
			note: args.note,
		});
	},
});

export const deleteRoutineExercise = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		routineId: v.id("routines"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "deleteRoutineExercise", { key: userId, throws: true });
		const routineExercise = await getOwnedRoutineExercise(ctx, args.routineExerciseId, userId);

		// Delete the routineExercise itself
		await ctx.db.delete(args.routineExerciseId);

		// Reorder remaining exercises
		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", routineExercise.routineId))
			.collect();

		for (const re of routineExercises) {
			if (re.order > routineExercise.order) {
				await ctx.db.patch(re._id, { order: re.order - 1 });
			}
		}
	},
});

export const moveUp = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		routineId: v.id("routines"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const routineExercise = await getOwnedRoutineExercise(ctx, args.routineExerciseId, user._id);

		if (routineExercise.order === 0) {
			return;
		}

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", routineExercise.routineId))
			.collect();

		const prevExercise = routineExercises.find((re) => re.order === routineExercise.order - 1);

		if (!prevExercise) {
			return;
		}

		await ctx.db.patch(args.routineExerciseId, { order: routineExercise.order - 1 });
		await ctx.db.patch(prevExercise._id, { order: routineExercise.order });
	},
});

export const moveDown = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		routineId: v.id("routines"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const routineExercise = await getOwnedRoutineExercise(ctx, args.routineExerciseId, user._id);

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", routineExercise.routineId))
			.collect();

		const nextExercise = routineExercises.find((re) => re.order === routineExercise.order + 1);

		if (!nextExercise) {
			return;
		}

		await ctx.db.patch(args.routineExerciseId, { order: routineExercise.order + 1 });
		await ctx.db.patch(nextExercise._id, { order: routineExercise.order });
	},
});
