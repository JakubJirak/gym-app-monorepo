import { Target } from "lucide-react-native";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import type { api } from "../../../../packages/convex/convex/_generated/api";
import Goal from "./goal";

export default function UserGoals({
	goals,
	stats,
}: {
	goals: NonNullable<typeof api.profile.getProfileOverview._returnType>["goals"];
	stats: typeof api.powerlifting.getPowerliftingStats._returnType;
}) {
	if (!goals) {
		return null;
	}

	return (
		<View className="mt-12 gap-4">
			<View className="mb-0 flex flex-row items-center gap-3 font-bold text-lg">
				<Target color={COLORS.accent} size={24} />
				<Text className="font-bold text-text text-xl">Vaše PR cíle</Text>
			</View>
			<View className="gap-6 rounded-xl bg-secondary p-5">
				<Goal goal={Number(goals.squat)} name="Squat" pr={stats.squatPR} />
				<Goal goal={Number(goals.bench)} name="Bench" pr={stats.benchPR} />
				<Goal goal={Number(goals.deadlift)} name="Deadlift" pr={stats.deadliftPR} />
			</View>
		</View>
	);
}
