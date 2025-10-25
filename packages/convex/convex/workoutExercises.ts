import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addSet = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
    weight: v.number(),
    reps: v.number(),
    order: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sets", {
      workoutExerciseId: args.workoutExerciseId,
      weight: args.weight,
      reps: args.reps,
      order: args.order
    })
  }
})

export const addWorkoutExercise = mutation({
  args: {
    exerciseId: v.id("exercises"),
    workoutId: v.id("workouts"),
    note: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workoutExercises", {
      exerciseId: args.exerciseId,
      workoutId: args.workoutId,
      note: args.note,
      order: args.order,
    })
  }
})

export const editExercise = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workoutExerciseId, {
      exerciseId: args.exerciseId,
    });
  }
})

export const editNote = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workoutExerciseId, {
      note: args.note,
    });
  }
})

export const editSet = mutation({
  args: {
    setId: v.id("sets"),
    reps: v.number(),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.setId, {
      reps: args.reps,
      weight: args.weight,
    });
  }
})

export const deleteSet = mutation({
  args: {
    setId: v.id("sets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.setId);
  }
})

export const deleteWorkoutExercise = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
  },
  handler: async (ctx, args) => {

    const sets = await ctx.db
      .query("sets")
      .withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", args.workoutExerciseId))
      .collect();

    for (const set of sets) {
      await ctx.db.delete(set._id);
    }

    await ctx.db.delete(args.workoutExerciseId);
  }
})
