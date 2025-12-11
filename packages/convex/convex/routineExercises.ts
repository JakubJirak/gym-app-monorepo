import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getRoutineExerciseById = query({
	args: {
		routineExerciseId: v.id("routinesExercises"),
	},
	handler: async (ctx, args) => ctx.db.get(args.routineExerciseId),
});

export const addRoutineExercise = mutation({
	args: {
		exerciseId: v.id("exercises"),
		routineId: v.id("routines"),
		note: v.optional(v.string()),
		order: v.number(),
	},
	handler: async (ctx, args) => {
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
