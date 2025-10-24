import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllFilters = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const userId = user._id;

    return await ctx.db.query("filters").withIndex("by_userId", (q) => q.eq("userId", userId)).collect();
  }
})
