import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserGoals = query({
	args: {},
	handler: async (ctx) => {
		let userId: string;
		try {
			//@ts-expect-error
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return null;
			}
			//@ts-expect-error
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return null
			console.error("Auth error in getUserGoals:", error);
			return null;
		}

		return await ctx.db
			.query("userGoals")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.first();
	},
});

export const addUserGoals = mutation({
	args: {
		bench: v.string(),
		squat: v.string(),
		deadlift: v.string(),
	},
	handler: async (ctx, args) => {
		// @ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null; // Uživatel není přihlášen
		}
		// @ts-expect-error
		const userId = user._id;

		await ctx.db.insert("userGoals", {
			userId,
			bench: args.bench,
			squat: args.squat,
			deadlift: args.deadlift,
		});

		return "Goals added successfully";
	},
});

export const updateUserGoals = mutation({
	args: {
		goalId: v.id("userGoals"),
		bench: v.string(),
		squat: v.string(),
		deadlift: v.string(),
	},
	handler: async (ctx, args) => {
		// @ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null; // Uživatel není přihlášen
		}
		// @ts-expect-error
		const userId = user._id;

		const goal = await ctx.db.get(args.goalId);
		if (!goal) {
			throw new Error("Goals not found");
		}
		if (goal.userId !== userId) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(args.goalId, {
			bench: args.bench,
			squat: args.squat,
			deadlift: args.deadlift,
		});

		return "Goals updated successfully";
	},
});
