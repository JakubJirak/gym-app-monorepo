import { useQuery } from "convex/react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import EmptyTrainings from "@/components/home/empty-trainings";
import LastTraining from "@/components/home/last-training";
import Tip from "@/components/home/tip";
import WeeklyStats from "@/components/home/weekly-stats";
import WelcomeMessage from "@/components/home/welcome-message";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";

export default function Index() {
	const workouts = useQuery(api.workouts.getUserWorkouts);

	if (workouts === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!workouts) {
		return null;
	}

	return (
		<ScrollView className="flex flex-1 bg-primary px-4 pt-4">
			<View className="flex-1 gap-6 pb-8">
				<WelcomeMessage />
				<Tip />
				<WeeklyStats trainings={workouts} />
				{workouts.length > 0 ? (
					<LastTraining workoutId={workouts[0]._id} workoutName={workouts[0].name} />
				) : (
					<EmptyTrainings />
				)}
			</View>
		</ScrollView>
	);
}
