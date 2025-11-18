import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	workouts: defineTable({
		userId: v.string(),
		name: v.string(),
		workoutDate: v.string(),
		filterId: v.id("filters"),
	})
		.index("by_userId", ["userId"])
		.index("by_filterId", ["filterId"]),

	workoutExercises: defineTable({
		workoutId: v.id("workouts"),
		exerciseId: v.id("exercises"),
		note: v.optional(v.string()),
		order: v.number(),
	})
		.index("by_workoutId", ["workoutId"])
		.index("by_exerciseId", ["exerciseId"]),

	sets: defineTable({
		workoutExerciseId: v.id("workoutExercises"),
		reps: v.number(),
		weight: v.number(),
		order: v.number(),
	}).index("by_workoutExerciseId", ["workoutExerciseId"]),

	exercises: defineTable({
		userId: v.string(),
		name: v.string(),
		muscleGroupId: v.id("muscleGroups"),
	})
		.index("by_userId", ["userId"])
		.index("by_muscleGroupId", ["muscleGroupId"]),

	muscleGroups: defineTable({
		name: v.string(),
	}).index("by_name", ["name"]),

	filters: defineTable({
		userId: v.string(),
		name: v.string(),
		color: v.string(),
	}).index("by_userId", ["userId"]),

	userGoals: defineTable({
		userId: v.string(),
		squat: v.string(),
		bench: v.string(),
		deadlift: v.string(),
	}).index("by_userId", ["userId"]),

	userWeights: defineTable({
		userId: v.string(),
		weight: v.string(),
	}).index("by_userId", ["userId"]),

	userDescription: defineTable({
		userId: v.string(),
		description: v.string(),
	}).index("by_userId", ["userId"]),
});
