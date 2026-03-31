import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { formatDate } from "@/src/utils/date-utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";

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
	const trainings = useQuery(api.workouts.getUserWorkouts);
	const name = `${NAMES.sheets.exerciseHistory}-${exerciseId}`;

	const closeModal = () => setVisible(false);

	useEffect(() => {
		if (visible) {
			TrueSheet.present(name);
		} else {
			TrueSheet.dismiss(name);
		}
	}, [name, visible]);

	const getLastThreeOccurrences = () => {
		if (!trainings) {
			return [];
		}

		return trainings
			.filter((training) => training._id !== currentTrainingId)
			.map((training) => {
				const exercise = training.exercises.find((e) => e.exercise?._id === exerciseId);
				if (exercise && exercise.sets.length > 0) {
					return {
						id: training._id,
						date: formatDate(new Date(training.workoutDate), "d. MMMM yyyy"),
						note: exercise.note,
						sets: exercise.sets,
					};
				}
				return null;
			})
			.filter((item) => item !== null)
			.slice(0, 3);
	};

	const history = getLastThreeOccurrences();

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
					data={history}
					ItemSeparatorComponent={() => <View className="my-2 h-0.5 bg-secondary" />}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={() => (
						<View className="py-8">
							<Text className="text-center text-muted">
								Tento cvik jste ještě nedělali v jiném tréninku
							</Text>
						</View>
					)}
					renderItem={({ item }) => (
						<View className="my-2">
							<Text className="mb-2 font-semibold text-text">{item.date}</Text>
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
