import { useQuery } from "convex/react";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { formatDate } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import { ExercisePicker } from "../forms/exercise-picker";
import HistoryExercise from "./history-exercise";
import HistoryGraph from "./history-graph";

export default function History() {
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const trainings = useQuery(api.workouts.getUserWorkouts);

	const getHistoryOfSetsById = (id: string) =>
		trainings
			?.map((training) => {
				const cvik = training.exercises.find((e) => e.exercise?._id === id);
				if (cvik) {
					return {
						id: training._id,
						name: formatDate(new Date(training.workoutDate), "d. MMMM yyyy"),
						date: training.workoutDate,
						sets: cvik.sets,
					};
				}
				return null;
			})
			.filter((item) => item !== null);

	const historySets = getHistoryOfSetsById(selectedId ?? "");

	if (!trainings) {
		return null;
	}

	if (!historySets) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-base text-muted">Žádná historie k zobrazení</Text>
			</View>
		);
	}

	return (
		<View>
			<Text>History Component</Text>
			<ExercisePicker onSelect={setSelectedId} selectedId={selectedId} />
			{selectedId && historySets && historySets.length > 0 && (
				<View className="-mx-4 mt-4">
					<HistoryGraph historySets={historySets} />
				</View>
			)}
			<FlatList
				className="mt-2"
				data={historySets}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={() => (
					<View className="flex-1 items-center justify-center py-10">
						<Text className="text-base text-muted">Žádná historie k zobrazení</Text>
					</View>
				)}
				renderItem={({ item }) => <HistoryExercise name={item.name} sets={item.sets} />}
			/>
		</View>
	);
}
