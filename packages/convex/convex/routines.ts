import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserRoutines = query({
	args: {},
	handler: async (ctx) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		const routines = await ctx.db
			.query("routines")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.collect();

		// Fetch filter data and exercises for each routine
		const routinesWithData = await Promise.all(
			routines.map(async (routine) => {
				const filter = await ctx.db.get(routine.filterId);

				const routineExercises = await ctx.db
					.query("routinesExercises")
					.withIndex("by_routineId", (q) => q.eq("routineId", routine._id))
					.collect();

				const sortedExercises = routineExercises.sort((a, b) => a.order - b.order);

				const exercisesWithData = await Promise.all(
					sortedExercises.map(async (re) => {
						const exercise = await ctx.db.get(re.exerciseId);
						const muscleGroup = exercise ? await ctx.db.get(exercise.muscleGroupId) : null;

						return {
							_id: re._id,
							exercise: exercise
								? {
										...exercise,
										muscleGroup: muscleGroup ? muscleGroup.name : null,
									}
								: null,
							order: re.order,
							routineId: re.routineId,
							note: re.note,
						};
					})
				);

				return {
					...routine,
					filter: filter || null,
					exercises: exercisesWithData,
				};
			})
		);

		return routinesWithData;
	},
});

export const getRoutineById = query({
	args: {
		routineId: v.id("routines"),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const routine = await ctx.db.get(args.routineId);
		if (!routine) {
			throw new Error("Unauthorized");
		}

		const filter = await ctx.db.get(routine.filterId);

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", routine._id))
			.collect();

		const sortedExercises = routineExercises.sort((a, b) => a.order - b.order);

		const exercisesWithData = await Promise.all(
			sortedExercises.map(async (re) => {
				const exercise = await ctx.db.get(re.exerciseId);
				const muscleGroup = exercise ? await ctx.db.get(exercise.muscleGroupId) : null;

				return {
					_id: re._id,
					exercise: exercise
						? {
								...exercise,
								muscleGroup: muscleGroup ? muscleGroup.name : null,
							}
						: null,
					order: re.order,
					routineId: re.routineId,
					note: re.note,
				};
			})
		);

		return {
			...routine,
			filter: filter || null,
			exercises: exercisesWithData,
		};
	},
});

export const addRoutine = mutation({
	args: {
		name: v.string(),
		filterId: v.id("filters"),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		const id = await ctx.db.insert("routines", {
			name: args.name,
			filterId: args.filterId,
			userId,
		});

		return { id };
	},
});

export const deleteRoutine = mutation({
	args: {
		routineId: v.id("routines"),
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

		for (const re of routineExercises) {
			await ctx.db.delete(re._id);
		}

		await ctx.db.delete(args.routineId);
	},
});

export const editRoutine = mutation({
	args: {
		routineId: v.id("routines"),
		name: v.string(),
		filterId: v.id("filters"),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(args.routineId, {
			name: args.name,
			filterId: args.filterId,
		});
	},
});

export const createWorkoutFromRoutine = mutation({
	args: {
		routineId: v.id("routines"),
		name: v.string(),
		workoutDate: v.string(),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		// Get the routine with its filter
		const routine = await ctx.db.get(args.routineId);
		if (!routine) {
			throw new Error("Unauthorized");
		}

		// Create the workout
		const workoutId = await ctx.db.insert("workouts", {
			userId,
			name: args.name,
			workoutDate: args.workoutDate,
			filterId: routine.filterId,
		});

		// Get all routine exercises
		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", args.routineId))
			.collect();

		// Sort by order
		const sortedExercises = routineExercises.sort((a, b) => a.order - b.order);

		// Create workout exercises from routine exercises
		for (const routineExercise of sortedExercises) {
			await ctx.db.insert("workoutExercises", {
				workoutId,
				exerciseId: routineExercise.exerciseId,
				order: routineExercise.order,
			});
		}

		return { workoutId };
	},
});
