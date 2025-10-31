import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, ChartColumnIncreasing, Repeat, TrendingUp, Weight } from "lucide-react";
import { useMemo } from "react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

const OverallStats = () => {
	const { data: trainings } = useSuspenseQuery(convexQuery(api.workouts.getUserWorkouts, {}));

	const allSets = useMemo(
		() =>
			trainings?.reduce(
				(acc, training) =>
					acc + training.exercises.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0),
				0
			),
		[trainings]
	);

	const allWeight = useMemo(
		() =>
			trainings?.reduce(
				(acc, training) =>
					acc +
					training.exercises.reduce(
						(exAcc, exercise) =>
							exAcc +
							exercise.sets.reduce(
								(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
								0
							),
						0
					),
				0
			),
		[trainings]
	);

	const allReps = useMemo(
		() =>
			trainings?.reduce(
				(acc, training) =>
					acc +
					training.exercises.reduce(
						(exAcc, exercise) =>
							exAcc +
							exercise.sets.reduce((setAcc, set) => setAcc + Number(set.reps ?? 0), 0),
						0
					),
				0
			),
		[trainings]
	);

	const totalWeight = allWeight !== undefined ? (allWeight / 100).toFixed(1) : "0";

	return (
		<div className="p-1">
			<p className="mb-4 flex items-center gap-3 font-bold text-lg">
				<ChartColumnIncreasing />
				Celkové statistiky
			</p>
			<div className="gird-rows-2 grid grid-cols-2 gap-5">
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Calendar />
					<p className="mt-1 font-bold text-2xl">{trainings?.length}</p>
					<p className="text-muted-foreground">Tréninky</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp />
					<p className="mt-1 font-bold text-2xl">{allSets}</p>
					<p className="text-muted-foreground">Série</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Weight />
					<p className="mt-1 font-bold text-2xl">{totalWeight}t</p>
					<p className="text-muted-foreground">Váha</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Repeat />
					<p className="mt-1 font-bold text-2xl">{allReps}</p>
					<p className="text-muted-foreground">Opakovaní</p>
				</div>
			</div>
		</div>
	);
};

export default OverallStats;
