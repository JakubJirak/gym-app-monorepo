import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { formatDate } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import { ExercisePicker } from "../forms/exercise-picker";
import HistoryExercise from "./history-exercise";
import HistoryGraph from "./history-graph";

type HistoryProps = {
	initialExerciseId?: string;
};

export default function History({ initialExerciseId }: HistoryProps) {
	const [selectedId, setSelectedId] = useState<string | undefined>(initialExerciseId);
	const history = useQuery(
		api.stats.getExerciseHistoryDetails,
		selectedId ? { exerciseId: selectedId as Id<"exercises"> } : "skip"
	);

	useEffect(() => {
		if (initialExerciseId) {
			setSelectedId(initialExerciseId);
		}
	}, [initialExerciseId]);

	const historyEntries = history?.entries ?? [];

	return (
		<View className="mt-2 flex-1 gap-2">
			<ExercisePicker onSelect={setSelectedId} selectedId={selectedId} />
			{selectedId && history === undefined ? (
				<View className="items-center py-10">
					<ActivityIndicator color={COLORS.accent} />
				</View>
			) : (
				<FlatList
					className="mt-2"
					data={historyEntries}
					ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
					keyExtractor={(item) => item.workoutId}
					ListEmptyComponent={() => (
						<View className="flex-1 items-center justify-center py-10">
							<Text className="text-base text-muted">
								{selectedId
									? `Žádná historie pro cvik ${history?.exerciseName ?? ""}`
									: "Vyberte cvik"}
							</Text>
						</View>
					)}
					ListHeaderComponent={
						selectedId && history && historyEntries.length > 0 ? (
							<View className="-mx-4 mb-2">
								<HistoryGraph historyPoints={history.chart} />
							</View>
						) : null
					}
					renderItem={({ item }) => (
						<HistoryExercise
							name={formatDate(new Date(item.date), "d. MMMM yyyy")}
							note={item.note}
							sets={item.sets}
							trainingId={item.workoutId}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}
