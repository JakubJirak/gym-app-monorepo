import { Text, View } from "react-native";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type PowerliftingStatsProps = {
	stats: typeof api.stats.getStatsOverview._returnType.powerlifting;
	userWeight: string | null;
};

export default function PowerliftingStats({ stats, userWeight }: PowerliftingStatsProps) {
	const { squatPR, benchPR, deadliftPR } = stats;
	const total = squatPR + benchPR + deadliftPR;

	if (total === 0) {
		return null;
	}

	return (
		<View className="-mt-2 rounded-xl bg-secondary px-2 py-5">
			<View className="flex-row">
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{squatPR}kg</Text>
					<Text className="text-base text-muted">Squat</Text>
					{userWeight ? (
						<Text className="text-white">{(squatPR / Number(userWeight)).toFixed(2)}x BW</Text>
					) : null}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{benchPR}kg</Text>
					<Text className="text-base text-muted">Bench</Text>
					{userWeight ? (
						<Text className="text-text">{(benchPR / Number(userWeight)).toFixed(2)}x BW</Text>
					) : null}
				</View>
				<View className="w-1/3 items-center gap-1">
					<Text className="text-text text-xl">{deadliftPR}kg</Text>
					<Text className="text-base text-muted">Deadlift</Text>
					{userWeight ? (
						<Text className="text-text">
							{(deadliftPR / Number(userWeight)).toFixed(2)}x BW
						</Text>
					) : null}
				</View>
			</View>
			<View className="my-5 h-0.5 w-full bg-border" />
			<View className="w-full items-center gap-1">
				<Text className="font-bold text-2xl text-text">{total}kg</Text>
				<Text className="text-lg text-muted">Total</Text>
				{userWeight ? (
					<Text className="text-text">{(total / Number(userWeight)).toFixed(2)}x BW</Text>
				) : null}
			</View>
		</View>
	);
}
