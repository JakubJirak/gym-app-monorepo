import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

// Create rate limiter instance with all endpoint configurations
export const rateLimiter = new RateLimiter(components.rateLimiter, {
	// Auth endpoints
	getUserWorkouts: { kind: "token bucket", rate: 10, period: MINUTE },
	getUserWorkout: { kind: "token bucket", rate: 10, period: MINUTE },
	addWorkout: { kind: "token bucket", rate: 10, period: MINUTE },
	updateWorkout: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteWorkout: { kind: "token bucket", rate: 10, period: MINUTE },

	// Filter endpoints
	getAllFilters: { kind: "token bucket", rate: 10, period: MINUTE },
	addFilter: { kind: "token bucket", rate: 20, period: MINUTE },
	updateFilter: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteFilter: { kind: "token bucket", rate: 10, period: MINUTE },

	// Exercise endpoints
	getAllExercises: { kind: "token bucket", rate: 10, period: MINUTE },
	addExercise: { kind: "token bucket", rate: 20, period: MINUTE },
	updateExercise: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteExercise: { kind: "token bucket", rate: 10, period: MINUTE },

	// Muscle group endpoints
	getAllMuscleGroups: { kind: "token bucket", rate: 10, period: MINUTE },

	// Routine endpoints
	getAllRoutines: { kind: "token bucket", rate: 10, period: MINUTE },
	addRoutine: { kind: "token bucket", rate: 10, period: MINUTE },
	updateRoutine: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteRoutine: { kind: "token bucket", rate: 10, period: MINUTE },

	// Routine exercise endpoints
	getRoutineExercises: { kind: "token bucket", rate: 10, period: MINUTE },
	addRoutineExercise: { kind: "token bucket", rate: 10, period: MINUTE },
	updateRoutineExercise: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteRoutineExercise: { kind: "token bucket", rate: 10, period: MINUTE },

	// Workout exercise endpoints
	getWorkoutExercises: { kind: "token bucket", rate: 10, period: MINUTE },
	addWorkoutSet: { kind: "token bucket", rate: 10, period: MINUTE },
	addWorkoutExercise: { kind: "token bucket", rate: 20, period: MINUTE },
	updateWorkoutExercise: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteWorkoutExercise: { kind: "token bucket", rate: 10, period: MINUTE },

	// Tips endpoints
	getAllTips: { kind: "token bucket", rate: 10, period: MINUTE },

	// User goals endpoints
	getUserGoals: { kind: "token bucket", rate: 10, period: MINUTE },
	addUserGoal: { kind: "token bucket", rate: 10, period: MINUTE },
	updateUserGoal: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteUserGoal: { kind: "token bucket", rate: 10, period: MINUTE },

	// User weights endpoints
	getUserWeights: { kind: "token bucket", rate: 10, period: MINUTE },
	addUserWeight: { kind: "token bucket", rate: 10, period: MINUTE },
	updateUserWeight: { kind: "token bucket", rate: 10, period: MINUTE },
	deleteUserWeight: { kind: "token bucket", rate: 10, period: MINUTE },

	// Description endpoints
	getDescription: { kind: "token bucket", rate: 10, period: MINUTE },
	updateDescription: { kind: "token bucket", rate: 10, period: MINUTE },
});
