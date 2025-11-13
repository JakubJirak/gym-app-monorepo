import { useQuery } from "convex/react";
import { Target } from "lucide-react-native";
import { Text, View } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";
import Goal from "./goal";

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

	if (!userGoals) {
		return null;
	}

	return (
		<View className="mt-12 gap-4 px-2">
			<View className="mb-0 flex flex-row items-center gap-3 font-bold text-lg">
				<Target color="white" size={24} />
				<Text className="font-bold text-text text-xl">Vaše PR cíle</Text>
			</View>
			<View className="gap-6">
				<Goal goal={Number(userGoals.squat)} name="Squat" pr={squatPR} />
				<Goal goal={Number(userGoals.bench)} name="Bench" pr={benchPR} />
				<Goal goal={Number(userGoals.deadlift)} name="Deadlift" pr={deadliftPR} />
			</View>
		</View>
	);
}
