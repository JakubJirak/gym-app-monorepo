import { useQuery } from "convex/react";
import { useContext } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import StatsGraph from "@/components/training/stats-graph";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { RoutineIdContext } from "./_layout";

export default function Stats() {
	const id = useContext(RoutineIdContext);

	const routine = useQuery(api.routines.getRoutineById, id ? { routineId: id as Id<"routines"> } : "skip");

	if (routine === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!routine) {
		return null;
	}

	return (
		<ScrollView className="flex-1 bg-primary px-4 pt-6 pb-8" showsVerticalScrollIndicator={false}>
			<StatsGraph exercises={routine.exercises} />
		</ScrollView>
	);
}
