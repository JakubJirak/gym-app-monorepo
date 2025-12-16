import { useQuery } from "convex/react";
import { FlatList, Text, View } from "react-native";
import Modal from "react-native-modal";
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

	const closeModal = () => setVisible(false);

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
		<Modal
			animationIn="fadeIn"
			animationOut="fadeOut"
			backdropOpacity={0.7}
			backdropTransitionOutTiming={0}
			isVisible={visible}
			onBackButtonPress={closeModal}
			onBackdropPress={closeModal}
			style={{ justifyContent: "center", alignItems: "center", margin: 0 }}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="max-h-[70%] w-[80%] rounded-xl bg-darker p-4">
				<Text className="mb-2 text-center font-bold text-text text-xl">{exerciseName}</Text>

				<FlatList
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
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</Modal>
	);
}
