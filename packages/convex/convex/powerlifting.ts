import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

const POWERLIFTING_EXERCISE_IDS = {
	squat: "k97fsv5mktmwx3a85nc3yf92e97sftej" as Id<"exercises">,
	bench: "k978awwr2wv1edjy57tmb1ncex7serqt" as Id<"exercises">,
	deadlift: "k971nc4hm5cfvk9rqxs86j1zqh7se6zv" as Id<"exercises">,
} as const;

type Lift = keyof typeof POWERLIFTING_EXERCISE_IDS;

const liftByExerciseId = new Map<Id<"exercises">, Lift>(
	Object.entries(POWERLIFTING_EXERCISE_IDS).map(([lift, exerciseId]) => [exerciseId, lift as Lift])
);

export const getPowerliftingStats = query({
	args: {},
	returns: v.object({
		squatPR: v.number(),
		benchPR: v.number(),
		deadliftPR: v.number(),
	}),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return { squatPR: 0, benchPR: 0, deadliftPR: 0 };
		}

		const workouts = await ctx.db
			.query("workouts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		const workoutExercises = (
			await Promise.all(
				workouts.map((workout) =>
					ctx.db
						.query("workoutExercises")
						.withIndex("by_workoutId", (q) => q.eq("workoutId", workout._id))
						.collect()
				)
			)
		).flat();

		const powerliftingExercises = workoutExercises.flatMap((workoutExercise) => {
			const lift = liftByExerciseId.get(workoutExercise.exerciseId);
			return lift ? [{ id: workoutExercise._id, lift }] : [];
		});
		const setsByExercise = await Promise.all(
			powerliftingExercises.map(({ id }) =>
				ctx.db
					.query("sets")
					.withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", id))
					.collect()
			)
		);

		const personalRecords: Record<Lift, number> = {
			squat: 0,
			bench: 0,
			deadlift: 0,
		};

		for (const [index, sets] of setsByExercise.entries()) {
			const lift = powerliftingExercises[index]?.lift;
			if (!lift) {
				continue;
			}

			for (const set of sets) {
				personalRecords[lift] = Math.max(personalRecords[lift], set.weight);
			}
		}

		return {
			squatPR: personalRecords.squat,
			benchPR: personalRecords.bench,
			deadliftPR: personalRecords.deadlift,
		};
	},
});
