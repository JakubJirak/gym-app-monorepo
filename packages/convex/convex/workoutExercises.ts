import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getWorkoutExerciseById = query({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
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
			console.error("Auth error in getWorkoutExerciseById:", error);
			return null;
		}

		return ctx.db.get(args.workoutExerciseId);
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
			.withIndex("by_workoutId", (q) => q.eq("workoutId", args.workoutId))
			.collect();

		for (const we of workoutExercises) {
			if (we.order > args.order) {
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		if (args.order === 0) {
			return;
		}

		const workoutExercises = await ctx.db
			.query("workoutExercises")
			.withIndex("by_workoutId", (q) => q.eq("workoutId", args.workoutId))
			.collect();

		const prevExercise = workoutExercises.find((we) => we.order === args.order - 1);

		if (!prevExercise) {
			return;
		}

		await ctx.db.patch(args.workoutExerciseId, { order: args.order - 1 });
		await ctx.db.patch(prevExercise._id, { order: args.order });
	},
});

export const moveDown = mutation({
	args: {
		workoutExerciseId: v.id("workoutExercises"),
		workoutId: v.id("workouts"),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const workoutExercises = await ctx.db
			.query("workoutExercises")
			.withIndex("by_workoutId", (q) => q.eq("workoutId", args.workoutId))
			.collect();

		const nextExercise = workoutExercises.find((we) => we.order === args.order + 1);

		if (!nextExercise) {
			return;
		}

		await ctx.db.patch(args.workoutExerciseId, { order: args.order + 1 });
		await ctx.db.patch(nextExercise._id, { order: args.order });
	},
});
