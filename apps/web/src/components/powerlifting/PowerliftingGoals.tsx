import { Target } from "lucide-react";
import PowerliftingGoal from "@/components/powerlifting/PowerliftingGoal.tsx";

type PowerliftingGoalsType = {
	benchPR: number;
	deadliftPR: number;
	squatPR: number;
	goals:
		| {
				squat: string;
				bench: string;
				deadlift: string;
		  }
		| null
		| undefined;
};

const PowerliftingGoals = ({ benchPR, squatPR, deadliftPR, goals }: PowerliftingGoalsType) => {
	if (!goals) {
		return null;
	}

	const getProgress = (personalRecord: number, goal: string) => {
		const numericGoal = Number(goal);
		if (!Number.isFinite(numericGoal) || numericGoal <= 0) {
			return 0;
		}
		return Math.max(0, Math.round((personalRecord / numericGoal) * 100));
	};

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
						value={getProgress(squatPR, goals.squat)}
					/>
					<PowerliftingGoal
						goal={goals.bench ?? ""}
						title="Bench"
						value={getProgress(benchPR, goals.bench)}
					/>
					<PowerliftingGoal
						goal={goals.deadlift ?? ""}
						title="Deadlift"
						value={getProgress(deadliftPR, goals.deadlift)}
					/>
				</div>
			</div>
		</div>
	);
};

export default PowerliftingGoals;
