import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserDescription = query({
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
			.query("userDescription")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.first();
	},
});

export const addUserDescription = mutation({
	args: {
		description: v.string(),
	},
	handler: async (ctx, { description }) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;

		await ctx.db.insert("userDescription", {
			description,
			userId,
		});
	},
});

export const editUserDescription = mutation({
	args: {
		descriptionId: v.id("userDescription"),
		description: v.string(),
	},

	handler: async (ctx, args) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(args.descriptionId, {
			description: args.description,
		});
	},
});
