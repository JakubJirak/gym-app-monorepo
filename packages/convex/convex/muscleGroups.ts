import { query } from "./_generated/server";

export const getAllMuscleGroups = query({
	args: {},
	handler: async (ctx) => await ctx.db.query("muscleGroups").collect(),
});
