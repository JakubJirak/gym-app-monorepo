import { useMemo } from "react";
import { Text, View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";
import { COLORS } from "@/constants/COLORS";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type MuscleGroupStatsProps = {
	trainings: typeof api.workouts.getUserWorkouts._returnType;
};

const MUSCLE_GROUP_COLORS = [
	COLORS.accent,
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#f59e0b",
	"#10b981",
	"#06b6d4",
	"#f43f5e",
];

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

	const chartData = useMemo(() => {
		const entries = Object.entries(muscleGroupCount);
		return entries.map(([_, count]) => count);
	}, [muscleGroupCount]);

	const labels = useMemo(() => Object.keys(muscleGroupCount), [muscleGroupCount]);

	if (!trainings || chartData.length === 0) {
		return null;
	}

	const maxValue = Math.max(...chartData);

	const polygonConfig = {
		stroke: COLORS.accent,
		strokeWidth: 2,
		fill: COLORS.accent,
		opacity: 0.5,
		isAnimated: true,
		animationDuration: 500,
	};

	const gridConfig = { strokeWidth: 0, opacity: 0.3, fill: COLORS.primary, showGradient: false };

	const asterLinesConfig = {
		stroke: COLORS.inactive,
		strokeWidth: 1,
		strokeDashArray: [2, 5],
	};

	const labelConfig = {
		fontSize: 12,
		stroke: "#ffffff",
	};

	return (
		<View className="gap-4 rounded-xl bg-secondary">
			<View className="items-center">
				<RadarChart
					animationDuration={500}
					asterLinesConfig={asterLinesConfig}
					chartSize={320}
					data={chartData}
					dataLabelsConfig={labelConfig}
					dataLabelsPositionOffset={15}
					gridConfig={gridConfig}
					isAnimated
					labelConfig={labelConfig}
					labels={labels}
					maxValue={maxValue * 1.2}
					noOfSections={1}
					polygonConfig={polygonConfig}
				/>
			</View>
			<View className="gap-2 px-6 pb-6">
				{labels.map((label, index) => (
					<View className="flex-row items-center gap-3" key={label}>
						<View
							className="h-3 w-3 rounded-full"
							style={{
								backgroundColor:
									MUSCLE_GROUP_COLORS[index % MUSCLE_GROUP_COLORS.length],
							}}
						/>
						<Text className="flex-1 text-base text-text">{label}</Text>
						<Text className="text-base text-muted">{muscleGroupCount[label]}x</Text>
					</View>
				))}
			</View>
		</View>
	);
}
