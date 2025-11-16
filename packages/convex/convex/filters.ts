import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllFilters = query({
	args: {},
	handler: async (ctx) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null;
		}
		//@ts-expect-error
		const userId = user._id;

		return await ctx.db
			.query("filters")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.collect();
	},
});

export const addFilter = mutation({
	args: {
		name: v.string(),
		color: v.string(),
	},
	handler: async (ctx, { name, color }) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			return null;
		}
		//@ts-expect-error
		const userId = user._id;

		await ctx.db.insert("filters", {
			name,
			color,
			userId,
		});
	},
});

export const editFilter = mutation({
	args: {
		filterId: v.id("filters"),
		name: v.string(),
		color: v.string(),
	},
	handler: async (ctx, { filterId, name, color }) => {
		await ctx.db.patch(filterId, {
			name,
			color,
		});
	},
});
