import { useQuery } from "convex/react";
import { Link, useRouter } from "expo-router";
import { Calendar, ChartColumnIncreasing, ChevronRight, History, Trophy } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import StatsCalendar from "@/components/stats/calendar";
import MuscleGroupStats from "@/components/stats/muscle-group-stats";
import PowerliftingStats from "@/components/stats/powerlifting-stats";
import Statistics from "@/components/stats/statistics";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Stats() {
	const router = useRouter();
	const trainings = useQuery(api.workouts.getUserWorkouts);

	const handleDatePress = (dateString: string) => {
		router.push({
			pathname: "/(auth)/(tabs)/stats/calendar",
			params: { selectedDate: dateString },
		});
	};

	if (trainings === undefined) {
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

	return (
		<ScrollView
			className="flex-1 bg-primary px-4"
			removeClippedSubviews={true}
			showsVerticalScrollIndicator={false}
		>
			<View className="gap-6 pb-8">
				<View>
					<View className="my-4 flex-row items-center gap-3">
						<ChartColumnIncreasing color={COLORS.accent} size={24} />
						<Text className="font-bold text-text text-xl">Celkové statistiky</Text>
					</View>
					<Statistics trainings={trainings} />
				</View>

				<View>
					<Link className="mt-6 mb-4" href="/stats/history">
						<View className="w-full flex-row items-center gap-3">
							<History color={COLORS.accent} size={24} />
							<Text className="font-bold text-white text-xl">Historie cviků</Text>
							<View className="mb-1 ml-auto">
								<ChevronRight color={COLORS.muted} size={20} />
							</View>
						</View>
					</Link>
					<View className="rounded-xl bg-secondary p-4">
						<Text className="text-base text-muted">
							Zobrazte si historii všech vašich sérií pro jednotlivé cviky!
						</Text>
					</View>
				</View>

				{trainings.length > 0 && (
					<View>
						<View className="my-4 flex-row items-center gap-3">
							<ChartColumnIncreasing color={COLORS.accent} size={24} />
							<Text className="font-bold text-text text-xl">Podle svalové partie</Text>
						</View>
						<MuscleGroupStats trainings={trainings} />
					</View>
				)}

				<View>
					<Link className="mt-6 mb-4" href="/(auth)/(tabs)/stats/calendar">
						<View className="justify w-full flex-row items-center gap-3">
							<Calendar color={COLORS.accent} size={24} />
							<Text className="font-bold text-white text-xl">Kalendář tréninků</Text>
							<View className="mb-1 ml-auto">
								<ChevronRight color={COLORS.muted} size={20} />
							</View>
						</View>
					</Link>
					<StatsCalendar onDatePress={handleDatePress} variant="nonselectable" />
				</View>

				<View>
					<Link className="mt-6 mb-4" href="/(auth)/(tabs)/profile/goals">
						<View className="w-full flex-row items-center gap-3">
							<Trophy color={COLORS.accent} size={24} />
							<Text className="font-bold text-white text-xl">Powerlifting PR</Text>
							<View className="mb-1 ml-auto">
								<ChevronRight color={COLORS.muted} size={20} />
							</View>
						</View>
					</Link>
					<PowerliftingStats />
				</View>
			</View>
		</ScrollView>
	);
}
