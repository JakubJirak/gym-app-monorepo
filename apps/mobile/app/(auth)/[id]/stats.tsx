import {
	ChartColumnIncreasing,
	Dumbbell,
	Repeat,
	TrendingUp,
	Weight,
} from "lucide-react-native";
import { useContext, useMemo } from "react";
import { Text, View } from "react-native";
import { TrainingIdContext } from "./_layout";
import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

export default function Stats() {
	const id = useContext(TrainingIdContext);

	const workout = useQuery(api.workouts.getWorkoutById, {
		workoutId: id as Id<"workouts">,
	});

	const totalWeight = useMemo(
		() =>
			workout?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
						0,
					),
				0,
			) ?? 0,
		[workout?.exercises],
	);

	const allReps = useMemo(
		() =>
			workout?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.reps ?? 0),
						0,
					),
				0,
			) ?? 0,
		[workout?.exercises],
	);

	const allSets = useMemo(
		() =>
			workout?.exercises?.reduce(
				(exAcc, exercise) => exAcc + exercise.sets.length,
				0,
			) ?? 0,
		[workout?.exercises],
	);

	const allExercises = workout?.exercises?.length ?? 0;

	if (!workout) return null;

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
						{totalWeight.toFixed(0)}kg
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
