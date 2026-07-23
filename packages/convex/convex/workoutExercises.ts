import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { authComponent } from "./auth";
import { rateLimiter } from "./rateLimit";

type DatabaseCtx = QueryCtx | MutationCtx;

async function getOwnedWorkout(ctx: DatabaseCtx, workoutId: Id<"workouts">, userId: string) {
	const workout = await ctx.db.get(workoutId);
	if (!workout || workout.userId !== userId) {
		throw new Error("Unauthorized");
	}
	return workout;
}

async function getOwnedWorkoutExercise(ctx: DatabaseCtx, workoutExerciseId: Id<"workoutExercises">, userId: string) {
	const workoutExercise = await ctx.db.get(workoutExerciseId);
	if (!workoutExercise) {
		throw new Error("Workout exercise not found");
	}
	await getOwnedWorkout(ctx, workoutExercise.workoutId, userId);
	return workoutExercise;
}

async function getOwnedSet(ctx: DatabaseCtx, setId: Id<"sets">, userId: string) {
	const set = await ctx.db.get(setId);
	if (!set) {
		throw new Error("Set not found");
	}
	await getOwnedWorkoutExercise(ctx, set.workoutExerciseId, userId);
	return set;
}

async function assertExerciseAvailable(ctx: DatabaseCtx, exerciseId: Id<"exercises">, userId: string) {
	const exercise = await ctx.db.get(exerciseId);
	if (!exercise || (exercise.userId !== userId && exercise.userId !== "default")) {
		throw new Error("Unauthorized");
	}
}

export const getWorkoutExerciseById = query({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
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
			console.error("Auth error in getWorkoutExerciseById:", error);
			return null;
		}

		try {
			return await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, userId);
		} catch {
			return null;
		}
	},
});

export const addSet = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		weight: v.number(),
		reps: v.number(),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "addWorkoutSet", { key: userId, throws: true });
		await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, userId);

		await ctx.db.insert("sets", {
			workoutExerciseId: args.workoutExerciseId,
			weight: args.weight,
			reps: args.reps,
			order: args.order,
		});
	},
});

export const addWorkoutExercise = mutation({
	args: {
		exerciseId: v.id("exercises"),
		workoutId: v.id("workouts"),
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
		await rateLimiter.limit(ctx, "addWorkoutExercise", { key: userId, throws: true });
		await Promise.all([
			getOwnedWorkout(ctx, args.workoutId, userId),
			assertExerciseAvailable(ctx, args.exerciseId, userId),
		]);

		await ctx.db.insert("workoutExercises", {
			exerciseId: args.exerciseId,
			workoutId: args.workoutId,
			note: args.note,
			order: args.order,
		});
	},
});

export const editExercise = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		exerciseId: v.id("exercises"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateWorkoutExercise", { key: userId, throws: true });
		await Promise.all([
			getOwnedWorkoutExercise(ctx, args.workoutExerciseId, userId),
			assertExerciseAvailable(ctx, args.exerciseId, userId),
		]);

		await ctx.db.patch(args.workoutExerciseId, {
			exerciseId: args.exerciseId,
		});
	},
});

export const editNote = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		note: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateWorkoutExercise", { key: userId, throws: true });
		await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, userId);

		await ctx.db.patch(args.workoutExerciseId, {
			note: args.note,
		});
	},
});

export const editSet = mutation({
	args: {
		setId: v.id("sets"),
		reps: v.number(),
		weight: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateWorkoutExercise", { key: userId, throws: true });
		await getOwnedSet(ctx, args.setId, userId);

		await ctx.db.patch(args.setId, {
			reps: args.reps,
			weight: args.weight,
		});
	},
});

export const deleteSet = mutation({
	args: {
		setId: v.id("sets"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "deleteWorkoutExercise", { key: userId, throws: true });
		await getOwnedSet(ctx, args.setId, userId);

		await ctx.db.delete(args.setId);
	},
});

export const deleteWorkoutExercise = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		workoutId: v.id("workouts"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "deleteWorkoutExercise", { key: userId, throws: true });
		const workoutExercise = await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, userId);

		// Delete all sets for this workoutExercise
		const sets = await ctx.db
			.query("sets")
			.withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", args.workoutExerciseId))
			.collect();

		for (const set of sets) {
			await ctx.db.delete(set._id);
		}

		// Delete the workoutExercise itself
		await ctx.db.delete(args.workoutExerciseId);

		// Reorder remaining exercises
		const workoutExercises = await ctx.db
			.query("workoutExercises")
			.withIndex("by_workoutId", (q) => q.eq("workoutId", workoutExercise.workoutId))
			.collect();

		for (const we of workoutExercises) {
			if (we.order > workoutExercise.order) {
				await ctx.db.patch(we._id, { order: we.order - 1 });
			}
		}
	},
});

export const moveUp = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		workoutId: v.id("workouts"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const workoutExercise = await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, user._id);

		if (workoutExercise.order === 0) {
			return;
		}

		const workoutExercises = await ctx.db
			.query("workoutExercises")
			.withIndex("by_workoutId", (q) => q.eq("workoutId", workoutExercise.workoutId))
			.collect();

		const prevExercise = workoutExercises.find((we) => we.order === workoutExercise.order - 1);

		if (!prevExercise) {
			return;
		}

		await ctx.db.patch(args.workoutExerciseId, { order: workoutExercise.order - 1 });
		await ctx.db.patch(prevExercise._id, { order: workoutExercise.order });
	},
});

export const moveDown = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		workoutId: v.id("workouts"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const workoutExercise = await getOwnedWorkoutExercise(ctx, args.workoutExerciseId, user._id);

		const workoutExercises = await ctx.db
			.query("workoutExercises")
			.withIndex("by_workoutId", (q) => q.eq("workoutId", workoutExercise.workoutId))
			.collect();

		const nextExercise = workoutExercises.find((we) => we.order === workoutExercise.order + 1);

		if (!nextExercise) {
			return;
		}

		await ctx.db.patch(args.workoutExerciseId, { order: workoutExercise.order + 1 });
		await ctx.db.patch(nextExercise._id, { order: workoutExercise.order });
	},
});
