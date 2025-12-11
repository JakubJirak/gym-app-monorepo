import { useQuery } from "convex/react";
import { ChartColumnIncreasing, Dumbbell } from "lucide-react-native";
import { useContext } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import StatsGraph from "@/components/training/stats-graph";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { RoutineIdContext } from "./_layout";

export default function Stats() {
	const id = useContext(RoutineIdContext);

	const routine = useQuery(api.routines.getRoutineById, id ? { routineId: id as Id<"routines"> } : "skip");

	const allExercises = routine?.exercises?.length ?? 0;

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
			<View className="mb-6 flex-row items-center gap-3">
				<ChartColumnIncreasing color={COLORS.accent} />
				<Text className="font-bold text-text text-xl">Celkové statistiky</Text>
			</View>
			<View className="flex-row gap-6">
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<Dumbbell color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{allExercises}</Text>
					<Text className="text-muted">Cviky</Text>
				</View>
				<View className="w-[47%] items-center justify-between gap-2 rounded-2xl bg-secondary py-4 text-center">
					<Dumbbell color="white" />
					<Text className="mt-1 font-bold text-2xl text-text">{allExercises}</Text>
					<Text className="text-muted">Cviky</Text>
				</View>
			</View>

			<View className="pb-10">
				<StatsGraph exercises={routine.exercises} />
			</View>
		</ScrollView>
	);
}
