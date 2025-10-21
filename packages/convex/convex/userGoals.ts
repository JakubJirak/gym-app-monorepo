import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserGoals = query({
  args: {},
  handler: async (ctx, args) => {
    // @ts-ignore
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null; // Uživatel není přihlášen
    }
    // @ts-ignore
    const userId = user._id;

    return await ctx.db.query("userGoals").withIndex("by_userId", (q) => q.eq("userId", userId)).first();
  }
})

export const addUserGoals = mutation({
  args: {
    bench: v.string(),
    squat: v.string(),
    deadlift: v.string(),
  },
  handler: async (ctx, args) => {
    // @ts-ignore
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null; // Uživatel není přihlášen
    }
    // @ts-ignore
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
    await ctx.db.patch(args.goalId, {
      bench: args.bench,
      squat: args.squat,
      deadlift: args.deadlift,
    });

    return "Goals updated successfully";
  }
});
