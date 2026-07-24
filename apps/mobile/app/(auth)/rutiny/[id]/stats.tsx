import { useContext } from "react";
import { ScrollView } from "react-native";
import StatsGraph from "@/components/training/stats-graph";
import { RoutineContext } from "./_layout";

export default function Stats() {
	const routine = useContext(RoutineContext);

	if (!routine) {
		return null;
	}

	return (
		<ScrollView className="flex-1 bg-primary px-4 pt-6 pb-8" showsVerticalScrollIndicator={false}>
			<StatsGraph exercises={routine.exercises} />
		</ScrollView>
	);
}
