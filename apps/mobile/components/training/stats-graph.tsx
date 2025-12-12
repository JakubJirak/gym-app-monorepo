import { ChartColumnIncreasing } from "lucide-react-native";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { COLORS } from "@/constants/COLORS";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type Exercise = {
	_id: string;
	exercise: {
		muscleGroup: string | null;
	} | null;
	note?: string;
	order: number;
	workoutId: string;
	sets?: Array<{
		_id: string;
		reps: number;
		weight: number;
		order: number;
	}>;
};

type Exercise2 = {
	_id: Id<"routinesExercises">;
	exercise: {
		muscleGroup: string | null;
		_id: Id<"exercises">;
		_creationTime: number;
		name: string;
		userId: string;
		muscleGroupId: Id<"muscleGroups">;
	} | null;
	order: number;
	routineId: Id<"routines">;
	note: string | undefined;
};

type StatsGraphProps = {
	exercises: Exercise[] | Exercise2[];
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

export default function StatsGraph({ exercises }: StatsGraphProps) {
	const muscleGroupCounts = exercises.reduce((acc: Record<string, number>, exercise) => {
		const muscleGroup = exercise.exercise?.muscleGroup ?? "";
		if (muscleGroup) {
			acc[muscleGroup] = (acc[muscleGroup] || 0) + 1;
		}
		return acc;
	}, {});

	const pieData = Object.entries(muscleGroupCounts).map(([name, count], index) => ({
		value: count,
		color: MUSCLE_GROUP_COLORS[index % MUSCLE_GROUP_COLORS.length],
		text: `${count}`,
		label: name,
	}));

	if (pieData.length === 0) {
		return null;
	}

	return (
		<View className="mb-6 gap-4">
			<View className="mb-6 flex-row items-center gap-3">
				<ChartColumnIncreasing color={COLORS.accent} />
				<Text className="font-bold text-text text-xl">Statistiky podle partie</Text>
			</View>
			<View className="items-center">
				<PieChart
					animationDuration={200}
					data={pieData}
					innerCircleColor={COLORS.secondary}
					innerRadius={60}
					isAnimated
					radius={100}
					showText
					textColor="white"
					textSize={16}
				/>
			</View>
			<View className="gap-2">
				{pieData.map((item) => (
					<View className="flex-row items-center gap-3" key={item.label}>
						<View className="h-4 w-4 rounded" style={{ backgroundColor: item.color }} />
						<Text className="flex-1 text-base text-text">{item.label}</Text>
						<Text className="text-base text-muted">{item.value}x</Text>
					</View>
				))}
			</View>
		</View>
	);
}
