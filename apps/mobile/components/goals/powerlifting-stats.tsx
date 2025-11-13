import { useQuery } from "convex/react";
import { Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";

export default function PowerliftingStats({
	squatPR,
	benchPR,
	deadliftPR,
}: {
	squatPR: number;
	benchPR: number;
	deadliftPR: number;
}) {
	const userWeight = useQuery(api.userWeights.getUserWeight);
	const total = squatPR + benchPR + deadliftPR;

	return (
		<View className="mt-6 px-2">
			<View className="mb-6 flex flex-row items-center gap-3 font-bold text-lg">
				<Trophy color="white" size={24} />
				<Text className="font-bold text-text text-xl">Powerlifting PR</Text>
			</View>
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
			<View className="my-4 h-0.5 w-full bg-secondary" />
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
