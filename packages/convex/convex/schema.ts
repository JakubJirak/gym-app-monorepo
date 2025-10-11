import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workouts: defineTable({
    userId: v.string(),
    name: v.string(),
    workoutDate: v.string(),
    filterId: v.id("filters"),
  }),
  workoutExercises: defineTable({
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
    note: v.optional(v.string()),
    order: v.number()
  }),
  sets: defineTable({
    workoutExerciseId: v.id("workoutExercises"),
    reps: v.number(),
    weight: v.number(),
    order: v.number(),
  }),
  exercises: defineTable({
    userId: v.string(),
    name: v.string(),
    muscleGroupId: v.id("muscleGroups")
  }),
  muscleGroups: defineTable({
    name: v.string(),
  }),
  filters: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string()
  }),
  userGoals: defineTable({
    userId: v.string(),
    squat: v.string(),
    bench: v.string(),
    deadlift: v.string()
  }),
  userWeights: defineTable({
    userId: v.string(),
    weight: v.string()
  }),
  test: defineTable({
    name: v.string()
  })
});
