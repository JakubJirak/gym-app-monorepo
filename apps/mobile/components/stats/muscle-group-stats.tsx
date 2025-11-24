import { useMemo } from "react";
import { Text, View } from "react-native";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type MuscleGroupStatsProps = {
	trainings: typeof api.workouts.getUserWorkouts._returnType;
};

export default function MuscleGroupStats({ trainings }: MuscleGroupStatsProps) {
	const muscleGroupCount = useMemo(() => {
		if (!trainings) {
			return {};
		}

		const count = trainings
			.flatMap((t) => t.exercises)
			.reduce<Record<string, number>>((acc, cvik) => {
				const group: string =
					cvik.exercise?.muscleGroup && cvik.exercise.muscleGroup !== null
						? cvik.exercise.muscleGroup
						: "Ostatní";
				acc[group] = (acc[group] || 0) + 1;
				return acc;
			}, {});

		return Object.fromEntries(Object.entries(count).sort(([, a], [, b]) => b - a));
	}, [trainings]);

	if (!trainings) {
		return null;
	}

	return (
		<View className="p-1">
			<View className="flex-row flex-wrap justify-between gap-y-4">
				{Object.entries(muscleGroupCount).map(([group, count]) => (
					<View
						className="w-[31%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center"
						key={group}
					>
						<Text className="mt-1 font-bold text-2xl text-text">{count}</Text>
						<Text className="text-center text-muted">{group}</Text>
					</View>
				))}
			</View>
		</View>
	);
}
