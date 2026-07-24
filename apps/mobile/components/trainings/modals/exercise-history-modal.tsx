import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { formatDate } from "@/src/utils/date-utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type ExerciseHistoryModalProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	exerciseId: string;
	exerciseName: string;
	currentTrainingId: string;
};

export default function ExerciseHistoryModal({
	visible,
	setVisible,
	exerciseId,
	exerciseName,
	currentTrainingId,
}: ExerciseHistoryModalProps) {
	const history = useQuery(
		api.stats.getExerciseHistoryDetails,
		visible
			? {
					exerciseId: exerciseId as Id<"exercises">,
					excludeWorkoutId: currentTrainingId as Id<"workouts">,
					limit: 3,
				}
			: "skip"
	);
	const name = `${NAMES.sheets.exerciseHistory}-${exerciseId}`;

	const closeModal = () => setVisible(false);

	useEffect(() => {
		if (visible) {
			TrueSheet.present(name);
		} else {
			TrueSheet.dismiss(name);
		}
	}, [name, visible]);

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.6, 0.9]}
			dimmedDetentIndex={0.1}
			name={name}
			onDidDismiss={closeModal}
			scrollable
		>
			<View className="flex-1 px-4 pt-8 pb-4">
				<Text className="mb-3 text-center font-bold text-text text-xl">{exerciseName}</Text>

				<FlatList
					className="flex-1"
					data={history?.entries}
					ItemSeparatorComponent={() => <View className="my-2 h-0.5 bg-secondary" />}
					keyExtractor={(item) => item.workoutId}
					ListEmptyComponent={() => (
						<View className="py-8">
							{history === undefined ? (
								<ActivityIndicator color={COLORS.accent} />
							) : (
								<Text className="text-center text-muted">
									Tento cvik jste ještě nedělali v jiném tréninku
								</Text>
							)}
						</View>
					)}
					renderItem={({ item }) => (
						<View className="my-2">
							<Text className="mb-2 font-semibold text-text">
								{formatDate(new Date(item.date), "d. MMMM yyyy")}
							</Text>
							{item.note && (
								<Text className="mb-2 text-muted text-sm">Poznámka: {item.note}</Text>
							)}
							<View className="gap-1.5">
								{item.sets.map((set, setIndex) => (
									<View
										className="flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-1.5"
										key={set._id}
									>
										<Text className="flex-1 text-text text-xs">
											{setIndex + 1}. série
										</Text>
										<Text className="font-semibold text-text">
											{set.weight}kg × {set.reps}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}
					scrollEnabled
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</TrueSheet>
	);
}
