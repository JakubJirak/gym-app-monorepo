import { useQuery } from "convex/react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import EmptyTrainings from "@/components/home/empty-trainings";
import LastTraining from "@/components/home/last-training";
import QuickLinks from "@/components/home/quick-links";
import Tip from "@/components/home/tip";
import WeeklyStats from "@/components/home/weekly-stats";
import WelcomeMessage from "@/components/home/welcome-message";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";

export default function Index() {
	const workouts = useQuery(api.workouts.getUserWorkouts);
	const tips = useQuery(api.tips.getTips);

	if (workouts === undefined || tips === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!(workouts && tips)) {
		return null;
	}

	return (
		<ScrollView className="flex flex-1 bg-primary px-4 pt-4" showsVerticalScrollIndicator={false}>
			<View className="flex-1 gap-10 pb-8">
				<WelcomeMessage />
				<Tip tips={tips} />
				<WeeklyStats trainings={workouts} />
				{workouts.length > 0 ? (
					<LastTraining workoutDate={workouts[0].workoutDate} workoutId={workouts[0]._id} />
				) : (
					<EmptyTrainings />
				)}
				<QuickLinks />
			</View>
		</ScrollView>
	);
}
