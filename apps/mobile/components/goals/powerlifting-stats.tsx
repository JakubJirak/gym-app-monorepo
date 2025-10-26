import { useQuery } from "convex/react";
import { Text, View } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";
import { Trophy } from "lucide-react-native";

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
		<View className="mt-6">
			<View className="flex flex-row gap-3 items-center text-lg font-bold mb-6">
				<Trophy size={24} color="white" />
				<Text className="text-white text-xl font-bold">Powerlifting PR</Text>
			</View>
			<View className="flex-row">
				<View className="w-1/3 items-center gap-1">
					<Text className="text-white text-xl">{squatPR}kg</Text>
					<Text className="text-muted text-base">Squat</Text>
					{userWeight && (
						<Text className="text-white">
							{(squatPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-white text-xl">{benchPR}kg</Text>
					<Text className="text-muted text-base">Bench</Text>
					{userWeight && (
						<Text className="text-white">
							{(benchPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-white text-xl">{deadliftPR}kg</Text>
					<Text className="text-muted text-base">Deadlift</Text>
					{userWeight && (
						<Text className="text-white">
							{(deadliftPR / Number(userWeight.weight)).toFixed(2)}x BW
						</Text>
					)}
				</View>
			</View>
			<View className="w-full h-0.5 bg-secondary my-4" />
			<View className="w-full items-center gap-1">
				<Text className="text-white text-2xl font-bold">{total}kg</Text>
				<Text className="text-muted text-lg">Total</Text>
				{userWeight && (
					<Text className="text-white">
						{(total / Number(userWeight.weight)).toFixed(2)}x BW
					</Text>
				)}
			</View>
		</View>
	);
}
