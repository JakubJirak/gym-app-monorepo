import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { formatDate } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import { ExercisePicker } from "../forms/exercise-picker";
import HistoryExercise from "./history-exercise";
import HistoryGraph from "./history-graph";

type HistoryProps = {
	initialExerciseId?: string;
};

export default function History({ initialExerciseId }: HistoryProps) {
	const [selectedId, setSelectedId] = useState<string | undefined>(initialExerciseId);
	const trainings = useQuery(api.workouts.getUserWorkouts);

	useEffect(() => {
		if (initialExerciseId) {
			setSelectedId(initialExerciseId);
		}
	}, [initialExerciseId]);

	const getHistoryOfSetsById = (id: string) =>
		trainings
			?.map((training) => {
				const cvik = training.exercises.find((e) => e.exercise?._id === id);
				if (cvik) {
					return {
						id: training._id,
						name: formatDate(new Date(training.workoutDate), "d. MMMM yyyy"),
						date: training.workoutDate,
						note: cvik.note,
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
		<View className="mt-2 flex-1 gap-2">
			<ExercisePicker onSelect={setSelectedId} selectedId={selectedId} />
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
				ListHeaderComponent={
					selectedId && historySets && historySets.length > 0 ? (
						<View className="-mx-4 mb-2">
							<HistoryGraph historySets={historySets} />
						</View>
					) : null
				}
				renderItem={({ item }) => (
					<HistoryExercise
						name={item.name}
						note={item.note}
						sets={item.sets}
						trainingId={item.id}
					/>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
