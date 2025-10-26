import { useQuery } from "convex/react";
import { View, Text } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";
import Goal from "./goal";
import { Target } from "lucide-react-native";

export default function UserGoals({
	squatPR,
	benchPR,
	deadliftPR,
}: {
	squatPR: number;
	benchPR: number;
	deadliftPR: number;
}) {
	const userGoals = useQuery(api.userGoals.getUserGoals);

	if (!userGoals) return null;
	return (
		<View className="gap-4 mt-12">
			<View className="flex flex-row gap-3 items-center text-lg font-bold mb-0">
				<Target size={24} color="white" />
				<Text className="text-white text-xl font-bold">Vaše PR cíle</Text>
			</View>
			<View className="gap-6">
				<Goal name="Squat" pr={squatPR} goal={Number(userGoals.squat)} />
				<Goal name="Bench" pr={benchPR} goal={Number(userGoals.bench)} />
				<Goal
					name="Deadlift"
					pr={deadliftPR}
					goal={Number(userGoals.deadlift)}
				/>
			</View>
		</View>
	);
}
