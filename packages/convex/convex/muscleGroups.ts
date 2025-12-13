import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllMuscleGroups = query({
	args: {},
	handler: async (ctx) => {
		//@ts-expect-error
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		return await ctx.db.query("muscleGroups").collect();
	},
});
