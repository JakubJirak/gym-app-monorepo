import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getTips = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx as unknown as GenericCtx<DataModel>);
		if (!user) {
			throw new Error("Unauthorized");
		}
		const tips = await ctx.db.query("tips").collect();
		return tips;
	},
});

// Tips data to insert:
// Content: "Nastavte si své cíle pro squat, bench a deadlift", Link: "/(auth)/(tabs)/profile/goals"
// Content: "Zaznamenejte si svou aktuální váhu", Link: "/(auth)/(tabs)/profile/edit/vaha"
// Content: "Přidejte si vlastní cvik do databáze", Link: "/(auth)/(tabs)/profile/exercises"
// Content: "Vytvořte si filtry pro organizaci tréninků", Link: "/(auth)/(tabs)/profile/filtry"
// Content: "Nastavte si tréninkové rutiny pro rychlejší plánování", Link: "/(auth)/(tabs)/profile/rutiny"
// Content: "Aktualizujte své profilové informace", Link: "/(auth)/(tabs)/profile/edit"
// Content: "Prohlédněte si historii tréninků v kalendáři", Link: "/(auth)/(tabs)/stats/calendar"
// Content: "Sledujte svůj pokrok v celkových statistikách", Link: "/(auth)/(tabs)/stats"
