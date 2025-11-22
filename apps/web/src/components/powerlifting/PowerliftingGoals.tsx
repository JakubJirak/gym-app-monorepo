import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import PowerliftingGoal from "@/components/powerlifting/PowerliftingGoal.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";

type PowerliftingGoalsType = {
	benchPR: number;
	deadliftPR: number;
	squatPR: number;
};

const PowerliftingGoals = ({ benchPR, squatPR, deadliftPR }: PowerliftingGoalsType) => {
	const { data: goals } = useSuspenseQuery(convexQuery(api.userGoals.getUserGoals, {}));

	if (!goals) {
		return null;
	}

	return (
		<div className="p-4">
			<h2 className="mb-4 flex items-center gap-3 font-bold text-lg">
				<Target />
				Vaše PR cíle
			</h2>

			<div>
				<div className="space-y-7">
					<PowerliftingGoal
						goal={goals.squat ?? ""}
						title="Squat"
						value={Number(((squatPR / Number(goals.squat)) * 100).toFixed(0))}
					/>
					<PowerliftingGoal
						goal={goals.bench ?? ""}
						title="Bench"
						value={Number(((benchPR / Number(goals.bench)) * 100).toFixed(0))}
					/>
					<PowerliftingGoal
						goal={goals.deadlift ?? ""}
						title="Deadlift"
						value={Number(((deadliftPR / Number(goals.deadlift)) * 100).toFixed(0))}
					/>
				</div>
			</div>
		</div>
	);
};

export default PowerliftingGoals;
