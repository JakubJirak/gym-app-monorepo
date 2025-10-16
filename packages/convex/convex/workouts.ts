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
