import { useRouter } from "expo-router";
import { Calendar, Repeat, TrendingUp, Weight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type StatisticsProps = {
	stats: typeof api.stats.getStatsOverview._returnType.overall;
};

export default function Statistics({ stats }: StatisticsProps) {
	const router = useRouter();
	const totalWeight = (stats.volumeKg / 1000).toFixed(1);

	return (
		<View className="p-1">
			<View className="flex-row flex-wrap justify-between gap-y-4">
				<TouchableOpacity
					activeOpacity={0.7}
					className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center"
					onPress={() => router.push("/(auth)/(tabs)/trainings")}
				>
					<Calendar color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{stats.workoutCount}</Text>
					<Text className="text-muted">Tréninky</Text>
				</TouchableOpacity>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{stats.setCount}</Text>
					<Text className="text-muted">Série</Text>
				</View>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Weight color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{totalWeight}t</Text>
					<Text className="text-muted">Váha</Text>
				</View>
				<View className="w-[48%] flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Repeat color="white" size={24} />
					<Text className="mt-1 font-bold text-2xl text-text">{stats.repCount}</Text>
					<Text className="text-muted">Opakovaní</Text>
				</View>
			</View>
		</View>
	);
}
