import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllFilters = query({
	args: {},
	handler: async (ctx) => {
		let userId: string;
		try {
			//@ts-expect-error
			const user = await authComponent.getAuthUser(ctx);
			if (!user) {
				return [];
			}
			//@ts-expect-error
			userId = user._id;
		} catch (error) {
			// Auth timeout or error - return empty results
			console.error("Auth error in getAllFilters:", error);
			return [];
		}

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
			throw new Error("Unauthorized");
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
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;
		const filter = await ctx.db.get(filterId);
		if (!filter) {
			throw new Error("Filter not found");
		}

		if (filter.userId !== userId) {
			throw new Error("Cannot edit default filter");
		}

		await ctx.db.patch(filterId, {
			name,
			color,
		});
	},
});

export const deleteFilter = mutation({
	args: {
		filterId: v.id("filters"),
	},
	handler: async (ctx, { filterId }) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}
		//@ts-expect-error
		const userId = user._id;
		const filter = await ctx.db.get(filterId);
		if (!filter) {
			throw new Error("Filter not found");
		}

		if (filter.userId !== userId) {
			throw new Error("Cannot delete default filter");
		}

		await ctx.db.delete(filterId);
	},
});
