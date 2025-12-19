import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllExercises = query({
	args: {},
	handler: async (ctx) => {
		let userId: string;
		try {
			//@ts-expect-error
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return [];
			}
			//@ts-expect-error
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return empty results
			console.error("Auth error in getAllExercises:", error);
			return [];
		}

		const userExercises = await ctx.db
			.query("exercises")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.collect();

		const defaultExercises = await ctx.db
			.query("exercises")
			.withIndex("by_userId", (q) => q.eq("userId", "default"))
			.collect();
		const allExercises = [...userExercises, ...defaultExercises];

		// Unikátní muscleGroupId
		// @ts-expect-error
		const muscleGroupIds = [...new Set(allExercises.map((e) => e.muscleGroupId))];

		// Načteme muscleGroups jednotlivě pomocí Promise.all
		const muscleGroupsArray = await Promise.all(
			muscleGroupIds.map((id) =>
				ctx.db
					.query("muscleGroups")
					.withIndex("by_id", (q) => q.eq("_id", id))
					.first()
			)
		);

		// Vytvoříme mapu id -> název
		const muscleGroupMap = muscleGroupsArray
			.filter((mg): mg is NonNullable<typeof mg> => mg !== null && mg !== undefined)
			.reduce(
				(acc, mg) => {
					acc[mg._id] = mg.name;
					return acc;
				},
				{} as Record<string, string>
			);

		// Vytvoříme pole objektů s názvem cviku a názvem muscleGroup
		const exercisesWithMuscleGroup = allExercises.map((exercise) => ({
			_id: exercise._id,
			_creationTime: exercise._creationTime,
			userId: exercise.userId,
			name: exercise.name,
			muscleGroup: muscleGroupMap[exercise.muscleGroupId] || null,
			muscleGroupId: exercise.muscleGroupId,
		}));

		return exercisesWithMuscleGroup;
	},
});

export const addExercise = mutation({
	args: {
		name: v.string(),
		muscleGroupId: v.id("muscleGroups"),
	},
	handler: async (ctx, args) => {
		// @ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		// @ts-expect-error
		const userId = user._id;

		const exerciseId = await ctx.db.insert("exercises", {
			userId,
			name: args.name,
			muscleGroupId: args.muscleGroupId,
		});
		return exerciseId;
	},
});

export const editExercise = mutation({
	args: {
		exerciseId: v.id("exercises"),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		const ex = await ctx.db.get(args.exerciseId);
		if (!ex) {
			throw new Error("Exercise not found");
		}

		if (ex.userId !== userId) {
			throw new Error("Cannot edit default exercise");
		}

		await ctx.db.patch(args.exerciseId, {
			name: args.name,
		});
	},
});

export const deleteExercise = mutation({
	args: {
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

		const ex = await ctx.db.get(args.exerciseId);
		if (!ex) {
			throw new Error("Exercise not found");
		}

		if (ex.userId !== userId) {
			throw new Error("Cannot delete default exercise");
		}

		await ctx.db.delete(args.exerciseId);
	},
});
