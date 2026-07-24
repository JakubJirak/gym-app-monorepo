import { useQuery } from "convex/react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import EmptyTrainings from "@/components/home/empty-trainings";
import LastTraining from "@/components/home/last-training";
import QuickLinks from "@/components/home/quick-links";
import Tip from "@/components/home/tip";
import WeeklyStats from "@/components/home/weekly-stats";
import WelcomeMessage from "@/components/home/welcome-message";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";

export default function Index() {
	const today = new Date();
	const currentDay = today.getDay();
	const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
	const monday = new Date(today);
	monday.setDate(today.getDate() + mondayOffset);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	const homeOverview = useQuery(api.workouts.getHomeOverview, {
		weekStart: toLocalISODateString(monday),
		weekEnd: toLocalISODateString(sunday),
	});
	const tips = useQuery(api.tips.getTips);

	if (homeOverview === undefined || tips === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	return (
		<ScrollView className="flex flex-1 bg-primary px-4 pt-4" showsVerticalScrollIndicator={false}>
			<View className="flex-1 gap-10 pb-8">
				<WelcomeMessage />
				<Tip tips={tips} />
				<WeeklyStats currentWeek={homeOverview.currentWeek} />
				{homeOverview.lastWorkout ? (
					<LastTraining
						workoutDate={homeOverview.lastWorkout.workoutDate}
						workoutId={homeOverview.lastWorkout._id}
					/>
				) : (
					<EmptyTrainings />
				)}
				<QuickLinks />
			</View>
		</ScrollView>
	);
}
