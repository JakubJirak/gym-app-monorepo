import { useQuery } from "convex/react";
import { Pencil, Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import CreateGoals from "@/components/goals/create-goals";
import EditGoals from "@/components/goals/edit-goals";
import PowerliftingStats from "@/components/goals/powerlifting-stats";
import UserGoals from "@/components/goals/user-goals";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Goals() {
	const [editGoalsVisible, setEditGoalsVisible] = useState(false);
	const [createGoalsVisible, setCreateGoalsVisible] = useState(false);
	const trainings = useQuery(api.workouts.getUserWorkouts);
	const userGoals = useQuery(api.userGoals.getUserGoals);

	const getSetsById = (id: string): number[] | undefined => {
		if (trainings !== undefined) {
			return trainings
				?.flatMap((training) => training.exercises)
				.filter((exercise) => exercise.exercise && exercise.exercise._id === id)
				.flatMap((exercise) => exercise.sets)
				.map((set) => Number(set.weight));
		}
		return [];
	};

	const maxWeight = (arr: number[]): number => {
		if (arr.length === 0) {
			return 0;
		}
		return Math.max(...arr);
	};

	const squatPR = maxWeight(getSetsById("k97fsv5mktmwx3a85nc3yf92e97sftej") ?? []);
	const benchPR = maxWeight(getSetsById("k978awwr2wv1edjy57tmb1ncex7serqt") ?? []);
	const deadliftPR = maxWeight(getSetsById("k971nc4hm5cfvk9rqxs86j1zqh7se6zv") ?? []);

	if (trainings === undefined || userGoals === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1 bg-primary">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Váhy a cíle" />
			<ScrollView className="flex-1 px-3 pb-16" showsVerticalScrollIndicator={false}>
				<PowerliftingStats benchPR={benchPR} deadliftPR={deadliftPR} squatPR={squatPR} />
				<UserGoals benchPR={benchPR} deadliftPR={deadliftPR} squatPR={squatPR} />
				<View className="h-30" />
			</ScrollView>

			{userGoals ? (
				<>
					<TouchableOpacity
						className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-3.5"
						onPress={() => setEditGoalsVisible(true)}
					>
						<Pencil color="white" size={32} />
					</TouchableOpacity>
					<EditGoals
						benchDef={userGoals.bench}
						deadliftDef={userGoals.deadlift}
						goalId={userGoals._id}
						setVisible={setEditGoalsVisible}
						squatDef={userGoals.squat}
						visible={editGoalsVisible}
					/>
				</>
			) : (
				<>
					<TouchableOpacity
						className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-2"
						onPress={() => setCreateGoalsVisible(true)}
					>
						<Plus color="white" size={44} />
					</TouchableOpacity>
					<CreateGoals setVisible={setCreateGoalsVisible} visible={createGoalsVisible} />
				</>
			)}
		</View>
	);
}
