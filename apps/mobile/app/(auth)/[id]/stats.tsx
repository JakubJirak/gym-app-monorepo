import {
	ChartColumnIncreasing,
	Dumbbell,
	Repeat,
	TrendingUp,
	Weight,
} from "lucide-react-native";
import { useContext, useMemo } from "react";
import { Text, View } from "react-native";
import { trainings } from "@/constants/trainings";
import { TrainingIdContext } from "./_layout";

export default function Stats() {
	const id = useContext(TrainingIdContext);

	const training = trainings.find((t) => t.id === id);

	const totalWeight = useMemo(
		() =>
			training?.workoutExercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
						0,
					),
				0,
			) ?? 0,
		[training?.workoutExercises],
	);

	const allReps = useMemo(
		() =>
			training?.workoutExercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.reps ?? 0),
						0,
					),
				0,
			) ?? 0,
		[training?.workoutExercises],
	);

	const allSets = useMemo(
		() =>
			training?.workoutExercises?.reduce(
				(exAcc, exercise) => exAcc + exercise.sets.length,
				0,
			) ?? 0,
		[training?.workoutExercises],
	);

	const allExercises = training?.workoutExercises?.length ?? 0;

	if (training === undefined) return null;

	return (
		<View className="bg-primary flex-1 pt-6 px-4">
			<View className="flex-row gap-3 items-center mb-6">
				<ChartColumnIncreasing color="white" />
				<Text className="text-white text-2xl font-bold">
					Celkové statistiky
				</Text>
			</View>

			<View className="flex-row gap-6">
				<View className="bg-secondary w-[47%] items-center py-4 justify-between gap-2 rounded-2xl text-center">
					<Dumbbell color="white" />
					<Text className="text-white text-2xl font-bold mt-1">
						{allExercises}
					</Text>
					<Text className="text-muted">Cviky</Text>
				</View>
				<View className="bg-secondary w-[47%] items-center py-4 justify-between gap-2 rounded-2xl text-center">
					<TrendingUp color="white" />
					<Text className="text-white text-2xl font-bold mt-1">{allSets}</Text>
					<Text className="text-muted">Série</Text>
				</View>
			</View>

			<View className="flex-row gap-6 mt-6">
				<View className="bg-secondary w-[47%] items-center py-4 justify-between gap-2 rounded-2xl text-center">
					<Weight color="white" />
					<Text className="text-white text-2xl font-bold mt-1">
						{totalWeight}kg
					</Text>
					<Text className="text-muted">Váha</Text>
				</View>
				<View className="bg-secondary w-[47%] items-center py-4 justify-between gap-2 rounded-2xl text-center">
					<Repeat color="white" />
					<Text className="text-white text-2xl font-bold mt-1">{allReps}</Text>
					<Text className="text-muted">Opakování</Text>
				</View>
			</View>
		</View>
	);
}
