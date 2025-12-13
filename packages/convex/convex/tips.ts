import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getTips = query({
	args: {},
	handler: async (ctx) => {
		try {
			const user = await authComponent.getAuthUser(ctx as unknown as GenericCtx<DataModel>);
			if (!user) {
				return [];
			}
		} catch (error) {
			// Auth timeout or error - return empty results
			console.error("Auth error in getTips:", error);
			return [];
		}
		const tips = await ctx.db.query("tips").collect();
		return tips;
	},
});
