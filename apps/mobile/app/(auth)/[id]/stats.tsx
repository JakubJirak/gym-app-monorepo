import { useQuery } from "convex/react";
import { ChartColumnIncreasing, Dumbbell, Repeat, TrendingUp, Weight } from "lucide-react-native";
import { useContext, useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { TrainingIdContext } from "./_layout";

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
						0
					),
				0
			) ?? 0,
		[workout?.exercises]
	);

	const allReps = useMemo(
		() =>
			workout?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc + exercise.sets.reduce((setAcc, set) => setAcc + Number(set.reps ?? 0), 0),
				0
			) ?? 0,
		[workout?.exercises]
	);

	const allSets = useMemo(
		() => workout?.exercises?.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0) ?? 0,
		[workout?.exercises]
	);

	const allExercises = workout?.exercises?.length ?? 0;

	if (workout === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!workout) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4 pt-6">
			<View className="mb-6 flex-row items-center gap-3">
				<ChartColumnIncreasing color={COLORS.accent} />
				<Text className="font-bold text-2xl text-text">Celkové statistiky</Text>
			</View>

			<View className="flex-row gap-6">
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<Dumbbell color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{allExercises}</Text>
					<Text className="text-muted">Cviky</Text>
				</View>
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{allSets}</Text>
					<Text className="text-muted">Série</Text>
				</View>
			</View>

			<View className="mt-6 flex-row gap-6">
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<Weight color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{totalWeight.toFixed(0)}kg</Text>
					<Text className="text-muted">Váha</Text>
				</View>
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<Repeat color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{allReps}</Text>
					<Text className="text-muted">Opakování</Text>
				</View>
			</View>
		</View>
	);
}
