import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserWorkouts = query({
  args: {},
  async handler(ctx, args) {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const userId = user._id;

    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc") // podle _creationTime v indexu
      .collect();

    const fullWorkouts = await Promise.all(
      workouts.map(async (workout) => {
        const filter = await ctx.db.get(workout.filterId);

        const workoutExercises = await ctx.db
          .query("workoutExercises")
          .withIndex("by_workoutId", (q) => q.eq("workoutId", workout._id))
          .collect();

        // Seřadí cviky podle jejich "order" hodnoty
        const sortedExercises = workoutExercises.sort((a, b) => a.order - b.order);

        const exercisesWithSets = await Promise.all(
          sortedExercises.map(async (we) => {
            const exercise = await ctx.db.get(we.exerciseId);
            const muscleGroup = exercise
              ? await ctx.db.get(exercise.muscleGroupId)
              : null;

            const sets = await ctx.db
              .query("sets")
              .withIndex("by_workoutExerciseId", (q) =>
                q.eq("workoutExerciseId", we._id),
              )
              .collect();

            // Seřadíme série podle order
            const sortedSets = sets.sort((a, b) => a.order - b.order);

            return {
              _id: we._id,
              exercise: exercise
                ? {
                    ...exercise,
                    muscleGroup: muscleGroup ? muscleGroup.name : null,
                  }
                : null,
              note: we.note,
              order: we.order,
              sets: sortedSets.map((set) => ({
                _id: set._id,
                reps: set.reps,
                weight: set.weight,
                order: set.order,
              })),
            };
          }),
        );

        return {
          _id: workout._id,
          name: workout.name,
          workoutDate: workout.workoutDate,
          filter: filter
            ? {
                _id: filter._id,
                name: filter.name,
                color: filter.color,
              }
            : null,
          exercises: exercisesWithSets,
        };
      }),
    );

    return fullWorkouts;
  },
});

export const getWorkoutById = query({
  args: {
    workoutId: v.id("workouts"),
  },
  async handler(ctx, args) {
    // Získej přihlášeného uživatele přes tvůj helper
    // @ts-ignore
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null; // Uživatel není přihlášen
    }
    // @ts-ignore
    const userId = user._id; // Interní databázové ID uživatele

    // Načti trénink podle ID
    const workout = await ctx.db.get(args.workoutId);
    if (!workout) {
      return null; // Trénink nenalezen
    }

    // Zkontroluj, že trénink patří přihlášenému uživateli
    if (workout.userId !== userId) {
      throw new Error("Přístup zamítnut: uživatel nevlastní tento trénink");
    }

    // Načti filtr a cviky se sériemi, stejně jako v předchozím kódu
    const filter = workout.filterId ? await ctx.db.get(workout.filterId) : null;

    const workoutExercises = await ctx.db
      .query("workoutExercises")
      .withIndex("by_workoutId", (q) => q.eq("workoutId", args.workoutId))
      .collect();

    const sortedExercises = workoutExercises.sort((a, b) => a.order - b.order);

    const exercisesWithSets = await Promise.all(
      sortedExercises.map(async (we) => {
        const exercise = await ctx.db.get(we.exerciseId);
        const muscleGroup = exercise ? await ctx.db.get(exercise.muscleGroupId) : null;

        const sets = await ctx.db
          .query("sets")
          .withIndex("by_workoutExerciseId", (q) => q.eq("workoutExerciseId", we._id))
          .collect();

        const sortedSets = sets.sort((a, b) => a.order - b.order);

        return {
          _id: we._id,
          exercise: exercise
            ? {
                ...exercise,
                muscleGroup: muscleGroup ? muscleGroup.name : null,
              }
            : null,
          note: we.note,
          order: we.order,
          sets: sortedSets.map((set) => ({
            _id: set._id,
            reps: set.reps,
            weight: set.weight,
            order: set.order,
          })),
        };
      }),
    );

    return {
      _id: workout._id,
      name: workout.name,
      workoutDate: workout.workoutDate,
      filter: filter
        ? {
            _id: filter._id,
            name: filter.name,
            color: filter.color,
          }
        : null,
      exercises: exercisesWithSets,
    };
  },
});

export const addWorkout = mutation(
  async ({ db }, {
    userId,
    name,
    workoutDate,
    filterId
  }: {
    userId: string,
    name: string,
    workoutDate: string,
    filterId: Id<"filters">
  }) => {
    // Přidání workoutu do databáze
    return await db.insert("workouts", {
      userId,
      name,
      workoutDate,
      filterId
    });
  }
);

export const createWorkout = mutation({
  args: {
    name: v.string(),
    workoutDate: v.string(),
    filterId: v.id("filters"),
    exercises: v.optional(
      v.array(
        v.object({
          exerciseId: v.id("exercises"),
          note: v.optional(v.string()),
          order: v.number(),
          sets: v.optional(
            v.array(
              v.object({
                reps: v.number(),
                weight: v.number(),
                order: v.number(),
              }),
            ),
          ),
        }),
      ),
    ),
  },
  async handler(ctx, args) {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const userId = user._id;

    // 1. Vytvoření tréninku
    const workoutId = await ctx.db.insert("workouts", {
      userId,
      name: args.name,
      workoutDate: args.workoutDate,
      filterId: args.filterId,
    });

    // 2. Pokud existují cviky, vytvoříme je
    if (args.exercises && args.exercises.length > 0) {
      for (const exercise of args.exercises) {
        const workoutExerciseId = await ctx.db.insert("workoutExercises", {
          workoutId,
          exerciseId: exercise.exerciseId,
          note: exercise.note ?? undefined,
          order: exercise.order,
        });

        // 3. Pokud existují série, vytvoříme je
        if (exercise.sets && exercise.sets.length > 0) {
          for (const set of exercise.sets) {
            await ctx.db.insert("sets", {
              workoutExerciseId,
              reps: set.reps,
              weight: set.weight,
              order: set.order,
            });
          }
        }
      }
    }

    return { workoutId };
  },
});
