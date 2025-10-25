import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllFilters = query({
  args: {},
  handler: async (ctx) => {
    //@ts-ignore
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    //@ts-ignore
    const userId = user._id;

    return await ctx.db.query("filters").withIndex("by_userId", (q) => q.eq("userId", userId)).collect();
  }
})

export const addFilter = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, { name, color }) => {
    //@ts-ignore
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    //@ts-ignore
    const userId = user._id;

    await ctx.db.insert("filters", {
      name,
      color,
      userId,
    });
  }
})
