import PowerliftingGoal from "@/components/powerlifting/PowerliftingGoal.tsx";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { api } from "../../../../../packages/convex/convex/_generated/api";

interface PowerflitingStatsType {
	benchPR: number;
	deadliftPR: number;
	squatPR: number;
}

const PowerliftingGoals = ({
	benchPR,
	squatPR,
	deadliftPR,
}: PowerflitingStatsType) => {
	const { data: goals } = useSuspenseQuery(
		convexQuery(api.userGoals.getUserGoals, {}),
	);

	if (!goals) return null;

	return (
		<div className="p-4">
			<h2 className="flex gap-3 items-center text-lg font-bold mb-4">
				<Target />
				Vaše PR cíle
			</h2>

			<div>
				<div className="space-y-7">
					<PowerliftingGoal
						title="Squat"
						goal={goals.squat ?? ""}
						value={Number(((squatPR / Number(goals.squat)) * 100).toFixed(0))}
					/>
					<PowerliftingGoal
						title="Bench"
						goal={goals.bench ?? ""}
						value={Number(((benchPR / Number(goals.bench)) * 100).toFixed(0))}
					/>
					<PowerliftingGoal
						title="Deadlift"
						goal={goals.deadlift ?? ""}
						value={Number(
							((deadliftPR / Number(goals.deadlift)) * 100).toFixed(0),
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default PowerliftingGoals;
