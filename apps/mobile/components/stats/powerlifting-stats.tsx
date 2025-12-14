import { useQuery } from "convex/react";
import { ActivityIndicator, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";

export default function PowerliftingStats() {
	const trainings = useQuery(api.workouts.getUserWorkouts);
	const userWeight = useQuery(api.userWeights.getUserWeight);

	const getSetsById = (id: string): number[] | undefined => {
		if (trainings !== undefined) {
			return trainings
				?.flatMap((training) => training.exercises)
				.filter((exercise) => exercise.exercise && exercise.exercise._id === id)
				.flatMap((exercise) => exercise.sets)
				.map((set) => Number(set.weight));
		}
		return [];
	};

	const maxWeight = (arr: number[]): number => {
		if (arr.length === 0) {
			return 0;
		}
		return Math.max(...arr);
	};

	const squatPR = maxWeight(getSetsById("k97fsv5mktmwx3a85nc3yf92e97sftej") ?? []);
	const benchPR = maxWeight(getSetsById("k978awwr2wv1edjy57tmb1ncex7serqt") ?? []);
	const deadliftPR = maxWeight(getSetsById("k971nc4hm5cfvk9rqxs86j1zqh7se6zv") ?? []);
	const total = squatPR + benchPR + deadliftPR;

	if (trainings === undefined || userWeight === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (trainings === null) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<Text className="text-lg text-white">Žádné tréninky k zobrazení</Text>
			</View>
		);
	}

	if (total === 0) {
		return null;
	}

	return (
		<View className="-mt-2 rounded-xl bg-secondary px-2 py-5">
			<View className="flex-row">
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{squatPR}kg</Text>
					<Text className="text-base text-muted">Squat</Text>
					{userWeight && (
						<Text className="text-white">
							{(squatPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{benchPR}kg</Text>
					<Text className="text-base text-muted">Bench</Text>
					{userWeight && (
						<Text className="text-text">
							{(benchPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{deadliftPR}kg</Text>
					<Text className="text-base text-muted">Deadlift</Text>
					{userWeight && (
						<Text className="text-text">
							{(deadliftPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
			</View>
			<View className="my-5 h-0.5 w-full bg-border" />
			<View className="w-full items-center gap-1">
				<Text className="font-bold text-2xl text-text">{total}kg</Text>
				<Text className="text-lg text-muted">Total</Text>
				{userWeight && (
					<Text className="text-text">{(total / Number(userWeight.weight)).toFixed(2)}x BW</Text>
				)}
			</View>
		</View>
	);
}
