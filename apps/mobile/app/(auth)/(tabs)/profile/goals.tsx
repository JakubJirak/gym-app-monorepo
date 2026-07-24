import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Pencil, Plus } from "lucide-react-native";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import CreateGoals from "@/components/goals/create-goals";
import EditGoals from "@/components/goals/edit-goals";
import PowerliftingStats from "@/components/goals/powerlifting-stats";
import UserGoals from "@/components/goals/user-goals";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Goals() {
	const stats = useQuery(api.powerlifting.getPowerliftingStats);
	const profile = useQuery(api.profile.getProfileOverview);

	if (stats === undefined || profile === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!profile) {
		return null;
	}

	const userGoals = profile.goals;

	return (
		<View className="flex-1 bg-primary">
			<View className="px-3">
				<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Váhy a cíle" />
			</View>

			<ScrollView className="flex-1 px-3 pb-16" showsVerticalScrollIndicator={false}>
				<PowerliftingStats
					benchPR={stats.benchPR}
					deadliftPR={stats.deadliftPR}
					squatPR={stats.squatPR}
					userWeight={profile.weight?.value ?? null}
				/>
				<UserGoals goals={userGoals} stats={stats} />
				<View className="h-30" />
			</ScrollView>

			{userGoals ? (
				<>
					<TouchableOpacity
						className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-4"
						onPress={() => TrueSheet.present(NAMES.sheets.editGoals)}
					>
						<Pencil color="white" size={24} />
					</TouchableOpacity>
					<EditGoals
						benchDef={userGoals.bench}
						deadliftDef={userGoals.deadlift}
						goalId={userGoals._id}
						squatDef={userGoals.squat}
					/>
				</>
			) : (
				<>
					<TouchableOpacity
						className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-3.5"
						onPress={() => TrueSheet.present(NAMES.sheets.createGoals)}
					>
						<Plus color="white" size={32} />
					</TouchableOpacity>
					<CreateGoals />
				</>
			)}
		</View>
	);
}
