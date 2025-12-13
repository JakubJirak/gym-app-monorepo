import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserWeight = query({
	args: {},
	handler: async (ctx) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		return await ctx.db
			.query("userWeights")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.first();
	},
});

export const addUserWeight = mutation({
	args: {
		weight: v.string(),
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		await ctx.db.insert("userWeights", {
			userId,
			weight: args.weight,
		});

		return "Weight added successfully";
	},
});

export const updateUserWeight = mutation({
	args: {
		weightId: v.id("userWeights"),
		changeWeight: v.string(), // očekává číslo jako vstupní parametr
	},
	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		const weightRecord = await ctx.db.get(args.weightId);
		if (!weightRecord) {
			throw new Error("Weight record not found");
		}
		if (weightRecord.userId !== userId) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(args.weightId, {
			weight: args.changeWeight,
		});

		return "Weight updated successfully";
	},
});
