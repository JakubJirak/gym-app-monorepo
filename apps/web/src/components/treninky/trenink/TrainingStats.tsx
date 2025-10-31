import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChartColumnIncreasing, Dumbbell, Repeat, TrendingUp, Weight } from "lucide-react";
import { useMemo } from "react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

const TrainingStats = ({ trainingId }: { trainingId: string }) => {
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		})
	);

	const totalWeight = useMemo(
		() =>
			training?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
						0
					),
				0
			) ?? 0,
		[training?.exercises]
	);

	const allReps = useMemo(
		() =>
			training?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc + exercise.sets.reduce((setAcc, set) => setAcc + Number(set.reps ?? 0), 0),
				0
			) ?? 0,
		[training?.exercises]
	);

	const allSets = useMemo(
		() => training?.exercises?.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0) ?? 0,
		[training?.exercises]
	);

	const allExercises = training?.exercises?.length ?? 0;

	return (
		<div>
			<p className="mb-4 flex items-center gap-3 font-bold text-lg">
				<ChartColumnIncreasing />
				Celkové statistiky
			</p>
			<div className="gird-rows-2 grid grid-cols-2 gap-5">
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Dumbbell />
					<p className="mt-1 font-bold text-2xl">{allExercises}</p>
					<p className="text-muted-foreground">Cviky</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp />
					<p className="mt-1 font-bold text-2xl">{allSets}</p>
					<p className="text-muted-foreground">Série</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Repeat />
					<p className="mt-1 font-bold text-2xl">{allReps}</p>
					<p className="text-muted-foreground">Opakovaní</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Weight />
					<p className="mt-1 font-bold text-2xl">{totalWeight}kg</p>
					<p className="text-muted-foreground">Váha</p>
				</div>
			</div>
		</div>
	);
};

export default TrainingStats;
