import type { Id } from "../../../packages/convex/convex/_generated/dataModel";

type SetType = {
	_id: Id<"sets">;
	reps: number;
	weight: number;
	order: number;
};

export const formatSetInfo = (set: SetType) => {
	const parts: string[] = [];
	if (set.weight) {
		parts.push(`${set.weight}kg`);
	}
	if (set.reps) {
		parts.push(`${set.reps}`);
	}
	return parts.join(" × ") || "Prázdná série";
};
