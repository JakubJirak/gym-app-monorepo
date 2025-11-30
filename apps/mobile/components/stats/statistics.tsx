import { useRouter } from "expo-router";
import { Calendar, Repeat, TrendingUp, Weight } from "lucide-react-native";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type StatisticsProps = {
	trainings: typeof api.workouts.getUserWorkouts._returnType;
};

export default function Statistics({ trainings }: StatisticsProps) {
	const router = useRouter();

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

	const totalWeight = (Number(allWeight) / 1000).toFixed(1);

	if (!trainings) {
		return null;
	}

	return (
		<View className="p-1">
			<View className="flex-row flex-wrap justify-between gap-y-4">
				<TouchableOpacity
					className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center"
					onPress={() => router.push("/(auth)/(tabs)/trainings")}
				>
					<Calendar color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{trainings?.length}</Text>
					<Text className="text-muted">Tréninky</Text>
				</TouchableOpacity>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{allSets}</Text>
					<Text className="text-muted">Série</Text>
				</View>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Weight color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{totalWeight}t</Text>
					<Text className="text-muted">Váha</Text>
				</View>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Repeat color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{allReps}</Text>
					<Text className="text-muted">Opakovaní</Text>
				</View>
			</View>
		</View>
	);
}
