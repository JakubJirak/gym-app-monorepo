import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
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
		<View className="mt-6">
			<View className="mb-6 flex flex-row items-center gap-3 font-bold text-lg">
				<Ionicons color={COLORS.accent} name="trophy-outline" size={26} />
				<Text className="font-bold text-text text-xl">Powerlifting PR</Text>
			</View>
			{total === 0 ? (
				<Text className="text-center text-base text-muted">
					Pro zobrazení powerlifting statistik si zapište alespoň jednu sérii dřepu, benche nebo
					deadliftu
				</Text>
			) : (
				<View className="rounded-xl bg-secondary p-5">
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
					<View className="my-4 h-0.5 w-full bg-border" />
					<View className="w-full items-center gap-1">
						<Text className="font-bold text-2xl text-text">{total}kg</Text>
						<Text className="text-lg text-muted">Total</Text>
						{userWeight && (
							<Text className="text-text">
								{(total / Number(userWeight.weight)).toFixed(2)}x BW
							</Text>
						)}
					</View>
				</View>
			)}
		</View>
	);
}
