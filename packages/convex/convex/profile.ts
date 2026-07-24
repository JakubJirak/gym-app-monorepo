import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { rateLimiter } from "./rateLimit";

const normalizeNumber = (value: string, field: string) => {
	const number = Number(value);
	if (!Number.isFinite(number) || number < 10 || number > 500) {
		throw new ConvexError(`${field} must be between 10 and 500`);
	}

	return number.toString();
};

const normalizeDescription = (value: string) => {
	const description = value.trim();
	if (!description || description.length > 200) {
		throw new ConvexError("Description must contain between 1 and 200 characters");
	}

	return description;
};

export const getProfileOverview = query({
	args: {},
	returns: v.union(
		v.object({
			account: v.object({
				name: v.string(),
				email: v.string(),
				createdAt: v.number(),
			}),
			description: v.union(
				v.object({
					_id: v.id("userDescription"),
					value: v.string(),
				}),
				v.null()
			),
			weight: v.union(
				v.object({
					_id: v.id("userWeights"),
					value: v.string(),
				}),
				v.null()
			),
			goals: v.union(
				v.object({
					_id: v.id("userGoals"),
					squat: v.string(),
					bench: v.string(),
					deadlift: v.string(),
				}),
				v.null()
			),
		}),
		v.null()
	),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null;
		}

		const [description, weight, goals] = await Promise.all([
			ctx.db
				.query("userDescription")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.first(),
			ctx.db
				.query("userWeights")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.first(),
			ctx.db
				.query("userGoals")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.first(),
		]);

		return {
			account: {
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			},
			description: description
				? {
						_id: description._id,
						value: description.description,
					}
				: null,
			weight: weight
				? {
						_id: weight._id,
						value: weight.weight,
					}
				: null,
			goals: goals
				? {
						_id: goals._id,
						squat: goals.squat,
						bench: goals.bench,
						deadlift: goals.deadlift,
					}
				: null,
		};
	},
});

export const setUserDescription = mutation({
	args: {
		description: v.string(),
	},
	returns: v.id("userDescription"),
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new ConvexError("Unauthorized");
		}

		await rateLimiter.limit(ctx, "updateDescription", { key: user._id, throws: true });

		const description = normalizeDescription(args.description);
		const current = await ctx.db
			.query("userDescription")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();

		if (current) {
			await ctx.db.patch(current._id, { description });
			return current._id;
		}

		return await ctx.db.insert("userDescription", {
			userId: user._id,
			description,
		});
	},
});

export const setUserWeight = mutation({
	args: {
		weight: v.string(),
	},
	returns: v.id("userWeights"),
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new ConvexError("Unauthorized");
		}

		const current = await ctx.db
			.query("userWeights")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();
		await rateLimiter.limit(ctx, current ? "updateUserWeight" : "addUserWeight", {
			key: user._id,
			throws: true,
		});

		const weight = normalizeNumber(args.weight, "Weight");
		if (current) {
			await ctx.db.patch(current._id, { weight });
			return current._id;
		}

		return await ctx.db.insert("userWeights", {
			userId: user._id,
			weight,
		});
	},
});

export const setUserGoals = mutation({
	args: {
		squat: v.string(),
		bench: v.string(),
		deadlift: v.string(),
	},
	returns: v.id("userGoals"),
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new ConvexError("Unauthorized");
		}

		const current = await ctx.db
			.query("userGoals")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.first();
		await rateLimiter.limit(ctx, current ? "updateUserGoal" : "addUserGoal", {
			key: user._id,
			throws: true,
		});

		const goals = {
			squat: normalizeNumber(args.squat, "Squat"),
			bench: normalizeNumber(args.bench, "Bench"),
			deadlift: normalizeNumber(args.deadlift, "Deadlift"),
		};

		if (current) {
			await ctx.db.patch(current._id, goals);
			return current._id;
		}

		return await ctx.db.insert("userGoals", {
			userId: user._id,
			...goals,
		});
	},
});

export const getMobileProfileOverview = query({
	args: {},
	returns: v.union(
		v.object({
			name: v.string(),
			description: v.union(v.string(), v.null()),
			weight: v.union(v.string(), v.null()),
			workoutCount: v.number(),
		}),
		v.null()
	),
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null;
		}

		const [description, weight, workouts] = await Promise.all([
			ctx.db
				.query("userDescription")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.first(),
			ctx.db
				.query("userWeights")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.first(),
			ctx.db
				.query("workouts")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.collect(),
		]);

		return {
			name: user.name,
			description: description?.description ?? null,
			weight: weight?.weight ?? null,
			workoutCount: workouts.length,
		};
	},
});
