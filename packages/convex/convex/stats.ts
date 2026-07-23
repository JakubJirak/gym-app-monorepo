import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { type QueryCtx, query } from "./_generated/server";
import { authComponent } from "./auth";

async function getWorkoutDataForUser(ctx: QueryCtx, userId: string) {
	const workouts = await ctx.db
		.query("workouts")
		.withIndex("by_userId", (q) => q.eq("userId", userId))
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

	return { workouts, workoutExercises };
}

export const getOverallStats = query({
	args: {},
	returns: v.object({
		workoutCount: v.number(),
		setCount: v.number(),
		repCount: v.number(),
		volumeKg: v.number(),
	}),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return {
				workoutCount: 0,
				setCount: 0,
				repCount: 0,
				volumeKg: 0,
			};
		}

		const { workouts, workoutExercises } = await getWorkoutDataForUser(ctx, user._id);
		const setsByWorkoutExercise = await Promise.all(
			workoutExercises.map((workoutExercise) =>
				ctx.db
					.query("sets")
					.withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", workoutExercise._id))
					.collect()
			)
		);

		let setCount = 0;
		let repCount = 0;
		let volumeKg = 0;

		for (const sets of setsByWorkoutExercise) {
			setCount += sets.length;
			for (const set of sets) {
				repCount += set.reps;
				volumeKg += set.weight * set.reps;
			}
		}

		return {
			workoutCount: workouts.length,
			setCount,
			repCount,
			volumeKg,
		};
	},
});

export const getMuscleGroupStats = query({
	args: {},
	returns: v.array(
		v.object({
			muscleGroupId: v.id("muscleGroups"),
			name: v.string(),
			exerciseCount: v.number(),
		})
	),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return [];
		}

		const { workoutExercises } = await getWorkoutDataForUser(ctx, user._id);
		const exerciseIds = [...new Set(workoutExercises.map((workoutExercise) => workoutExercise.exerciseId))];
		const exercises = await Promise.all(exerciseIds.map((exerciseId) => ctx.db.get(exerciseId)));
		const exercisesById = new Map(
			exercises
				.filter((exercise): exercise is NonNullable<typeof exercise> => exercise !== null)
				.map((exercise) => [exercise._id, exercise])
		);

		const countsByMuscleGroup = new Map<Id<"muscleGroups">, number>();
		for (const workoutExercise of workoutExercises) {
			const exercise = exercisesById.get(workoutExercise.exerciseId);
			if (!exercise) {
				continue;
			}

			countsByMuscleGroup.set(
				exercise.muscleGroupId,
				(countsByMuscleGroup.get(exercise.muscleGroupId) ?? 0) + 1
			);
		}

		const muscleGroupIds = [...countsByMuscleGroup.keys()];
		const muscleGroups = await Promise.all(muscleGroupIds.map((muscleGroupId) => ctx.db.get(muscleGroupId)));
		const muscleGroupsById = new Map(
			muscleGroups
				.filter((muscleGroup): muscleGroup is NonNullable<typeof muscleGroup> => muscleGroup !== null)
				.map((muscleGroup) => [muscleGroup._id, muscleGroup])
		);

		return muscleGroupIds
			.flatMap((muscleGroupId) => {
				const muscleGroup = muscleGroupsById.get(muscleGroupId);
				if (!muscleGroup) {
					return [];
				}

				return [
					{
						muscleGroupId,
						name: muscleGroup.name,
						exerciseCount: countsByMuscleGroup.get(muscleGroupId) ?? 0,
					},
				];
			})
			.sort((a, b) => b.exerciseCount - a.exerciseCount || a.name.localeCompare(b.name, "cs"));
	},
});

export const getExerciseHistory = query({
	args: {
		exerciseId: v.id("exercises"),
	},
	returns: v.object({
		entries: v.array(
			v.object({
				workoutId: v.id("workouts"),
				date: v.string(),
				sets: v.array(
					v.object({
						_id: v.id("sets"),
						reps: v.number(),
						weight: v.number(),
						order: v.number(),
					})
				),
			})
		),
		chart: v.array(
			v.object({
				date: v.string(),
				value: v.number(),
				reps: v.number(),
			})
		),
	}),
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return { entries: [], chart: [] };
		}

		const exercise = await ctx.db.get(args.exerciseId);
		if (!(exercise && (exercise.userId === user._id || exercise.userId === "default"))) {
			return { entries: [], chart: [] };
		}

		let workouts: Doc<"workouts">[];
		let matchingWorkoutExercises: Doc<"workoutExercises">[];

		if (exercise.userId === user._id) {
			const workoutExercises = await ctx.db
				.query("workoutExercises")
				.withIndex("by_exerciseId", (q) => q.eq("exerciseId", args.exerciseId))
				.collect();
			const workoutIds = [...new Set(workoutExercises.map((workoutExercise) => workoutExercise.workoutId))];
			const referencedWorkouts = await Promise.all(workoutIds.map((workoutId) => ctx.db.get(workoutId)));
			workouts = referencedWorkouts.filter(
				(workout): workout is NonNullable<typeof workout> =>
					workout !== null && workout.userId === user._id
			);
			const ownedWorkoutIds = new Set(workouts.map((workout) => workout._id));
			matchingWorkoutExercises = workoutExercises.filter((workoutExercise) =>
				ownedWorkoutIds.has(workoutExercise.workoutId)
			);
		} else {
			const workoutData = await getWorkoutDataForUser(ctx, user._id);
			workouts = workoutData.workouts;
			matchingWorkoutExercises = workoutData.workoutExercises.filter(
				(workoutExercise) => workoutExercise.exerciseId === args.exerciseId
			);
		}

		const histories = await Promise.all(
			matchingWorkoutExercises.map(async (workoutExercise) => ({
				workoutExercise,
				sets: await ctx.db
					.query("sets")
					.withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", workoutExercise._id))
					.collect(),
			}))
		);

		const historyByWorkout = new Map<
			Id<"workouts">,
			{
				workoutExerciseOrder: number;
				sets: (typeof histories)[number]["sets"];
			}[]
		>();

		for (const { workoutExercise, sets } of histories) {
			const history = historyByWorkout.get(workoutExercise.workoutId) ?? [];
			history.push({
				workoutExerciseOrder: workoutExercise.order,
				sets,
			});
			historyByWorkout.set(workoutExercise.workoutId, history);
		}

		const entries = workouts
			.flatMap((workout) => {
				const history = historyByWorkout.get(workout._id);
				if (!history) {
					return [];
				}

				const sets = history
					.sort((a, b) => a.workoutExerciseOrder - b.workoutExerciseOrder)
					.flatMap((item) => item.sets.sort((a, b) => a.order - b.order))
					.map((set) => ({
						_id: set._id,
						reps: set.reps,
						weight: set.weight,
						order: set.order,
					}));
				if (sets.length === 0) {
					return [];
				}

				return [
					{
						workoutId: workout._id,
						date: workout.workoutDate,
						sets,
					},
				];
			})
			.sort((a, b) => b.date.localeCompare(a.date));

		const chart = entries
			.flatMap((entry) => {
				if (entry.sets.length === 0) {
					return [];
				}

				const maxWeight = Math.max(...entry.sets.map((set) => set.weight));
				const reps = Math.max(
					...entry.sets.filter((set) => set.weight === maxWeight).map((set) => set.reps)
				);

				return [
					{
						date: entry.date,
						value: maxWeight,
						reps,
					},
				];
			})
			.reverse();

		return { entries, chart };
	},
});
