/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as description from "../description.js";
import type * as exercises from "../exercises.js";
import type * as filters from "../filters.js";
import type * as http from "../http.js";
import type * as muscleGroups from "../muscleGroups.js";
import type * as powerlifting from "../powerlifting.js";
import type * as rateLimit from "../rateLimit.js";
import type * as routineExercises from "../routineExercises.js";
import type * as routines from "../routines.js";
import type * as stats from "../stats.js";
import type * as tips from "../tips.js";
import type * as userGoals from "../userGoals.js";
import type * as userWeights from "../userWeights.js";
import type * as workoutExercises from "../workoutExercises.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  description: typeof description;
  exercises: typeof exercises;
  filters: typeof filters;
  http: typeof http;
  muscleGroups: typeof muscleGroups;
  powerlifting: typeof powerlifting;
  rateLimit: typeof rateLimit;
  routineExercises: typeof routineExercises;
  routines: typeof routines;
  stats: typeof stats;
  tips: typeof tips;
  userGoals: typeof userGoals;
  userWeights: typeof userWeights;
  workoutExercises: typeof workoutExercises;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
