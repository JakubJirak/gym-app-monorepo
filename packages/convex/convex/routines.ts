import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { rateLimiter } from "./rateLimit";

export const getUserRoutineSummaries = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("routines"),
			name: v.string(),
			filter: v.union(
				v.object({
					name: v.string(),
					color: v.string(),
				}),
				v.null()
			),
		})
	),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return [];
		}

		const routines = await ctx.db
			.query("routines")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();
		const filterIds = [...new Set(routines.map((routine) => routine.filterId))];
		const filters = await Promise.all(filterIds.map((filterId) => ctx.db.get(filterId)));
		const filtersById = new Map(
			filters
				.filter((filter): filter is NonNullable<typeof filter> => filter !== null)
				.map((filter) => [filter._id, filter])
		);

		return routines.map((routine) => {
			const filter = filtersById.get(routine.filterId);

			return {
				_id: routine._id,
				name: routine.name,
				filter: filter ? { name: filter.name, color: filter.color } : null,
			};
		});
	},
});

export const getRoutineDetail = query({
	args: {
		routineId: v.id("routines"),
	},
	returns: v.union(
		v.object({
			_id: v.id("routines"),
			name: v.string(),
			exercises: v.array(
				v.object({
					_id: v.id("routinesExercises"),
					exercise: v.union(
						v.object({
							name: v.string(),
							muscleGroup: v.union(v.string(), v.null()),
						}),
						v.null()
					),
				})
			),
		}),
		v.null()
	),
	handler: async (ctx, { routineId }) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null;
		}

		const routine = await ctx.db.get(routineId);
		if (!routine || routine.userId !== user._id) {
			return null;
		}

		const routineExercises = await ctx.db
			.query("routinesExercises")
			.withIndex("by_routineId", (q) => q.eq("routineId", routineId))
			.collect();
		routineExercises.sort((a, b) => a.order - b.order);

		const exerciseIds = [...new Set(routineExercises.map((item) => item.exerciseId))];
		const exercises = await Promise.all(exerciseIds.map((exerciseId) => ctx.db.get(exerciseId)));
		const exercisesById = new Map(
			exercises
				.filter((exercise): exercise is NonNullable<typeof exercise> => exercise !== null)
				.map((exercise) => [exercise._id, exercise])
		);

		const muscleGroupIds = [
			...new Set(exercises.flatMap((exercise) => (exercise ? [exercise.muscleGroupId] : []))),
		];
		const muscleGroups = await Promise.all(muscleGroupIds.map((muscleGroupId) => ctx.db.get(muscleGroupId)));
		const muscleGroupsById = new Map(
			muscleGroups
				.filter((muscleGroup): muscleGroup is NonNullable<typeof muscleGroup> => muscleGroup !== null)
				.map((muscleGroup) => [muscleGroup._id, muscleGroup])
		);

		return {
			_id: routine._id,
			name: routine.name,
			exercises: routineExercises.map((routineExercise) => {
				const exercise = exercisesById.get(routineExercise.exerciseId);
				return {
					_id: routineExercise._id,
					exercise: exercise
						? {
								name: exercise.name,
								muscleGroup: muscleGroupsById.get(exercise.muscleGroupId)?.name ?? null,
							}
						: null,
				};
			}),
		};
	},
});

export const getUserRoutines = query({
	args: {},
	handler: async (ctx) => {
		let userId: string;
		try {
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return [];
			}
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return empty results
			console.error("Auth error in getUserRoutines:", error);
			return [];
		}

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
		let userId: string;
		try {
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return null;
			}
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return null
			console.error("Auth error in getRoutineById:", error);
			return null;
		}

		const routine = await ctx.db.get(args.routineId);
		if (!routine) {
			return null;
		}
		if (routine.userId !== userId) {
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
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "addRoutine", { key: userId, throws: true });

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
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "deleteRoutine", { key: userId, throws: true });

		const routine = await ctx.db.get(args.routineId);
		if (!routine) {
			throw new Error("Routine not found");
		}
		if (routine.userId !== userId) {
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
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const userId = user._id;

		// Rate limiting
		await rateLimiter.limit(ctx, "updateRoutine", { key: userId, throws: true });

		const routine = await ctx.db.get(args.routineId);
		if (!routine) {
			throw new Error("Routine not found");
		}
		if (routine.userId !== userId) {
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
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
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
			isShared: false,
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
