import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { rateLimiter } from "./rateLimit";

export const getRoutineExerciseById = query({
	args: {
		routineExerciseId: v.id("routinesExercises"),
	},
	handler: async (ctx, args) => {
		try {
			//@ts-expect-error
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return null;
			}
		} catch (error) {
			// Auth timeout or error - return null
			console.error("Auth error in getRoutineExerciseById:", error);
			return null;
		}

		return ctx.db.get(args.routineExerciseId);
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "addRoutineExercise", { key: userId, throws: true });

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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateRoutineExercise", { key: userId, throws: true });

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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateRoutineExercise", { key: userId, throws: true });

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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "deleteRoutineExercise", { key: userId, throws: true });

		// Delete the routineExercise itself
		await ctx.db.delete(args.routineExerciseId);

		// Reorder remaining exercises
		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
			.collect();

		for (const re of routineExercises) {
			if (re.order > args.order) {
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		if (args.order === 0) {
			return;
		}

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
			.collect();

		const prevExercise = routineExercises.find((re) => re.order === args.order - 1);

		if (!prevExercise) {
			return;
		}

		await ctx.db.patch(args.routineExerciseId, { order: args.order - 1 });
		await ctx.db.patch(prevExercise._id, { order: args.order });
	},
});

export const moveDown = mutation({
	args: {
		routineExerciseId: v.id("routinesExercises"),
		routineId: v.id("routines"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
			.collect();

		const nextExercise = routineExercises.find((re) => re.order === args.order + 1);

		if (!nextExercise) {
			return;
		}

		await ctx.db.patch(args.routineExerciseId, { order: args.order + 1 });
		await ctx.db.patch(nextExercise._id, { order: args.order });
	},
});
