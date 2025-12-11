import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { ExercisePicker } from "@/components/forms/exercise-picker";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type AddExerciseProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	trainingId: string;
	exercises: number;
};

export default function AddExerciseModal({ sheetVisible, setSheetVisible, trainingId, exercises }: AddExerciseProps) {
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const closeSheet = () => setSheetVisible(false);
	const addExercise = useMutation(api.workoutExercises.addWorkoutExercise).withOptimisticUpdate(
		(localStore, args) => {
			const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
			const allExercises = localStore.getQuery(api.exercises.getAllExercises, {});

			for (const query of queries) {
				const currentData = query.value;
				if (currentData && query.args.workoutId === args.workoutId && allExercises) {
					const exerciseData = allExercises.find((ex) => ex._id === args.exerciseId);

					const optimisticExercise = {
						_id: `temp-${Date.now()}` as Id<"workoutExercises">,
						exercise: exerciseData || null,
						note: undefined,
						sets: [],
						order: args.order,
						workoutId: args.workoutId,
					};
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...currentData,
						exercises: [...currentData.exercises, optimisticExercise],
					});
				}
			}
		}
	);

	const handleAddExercise = () => {
		if (selectedId !== undefined) {
			addExercise({
				workoutId: trainingId as Id<"workouts">,
				exerciseId: selectedId as Id<"exercises">,
				order: exercises,
			});
		}
		setSelectedId(undefined);
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[40%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 items-center justify-between">
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="white" name="add-outline" size={32} />
						<Text className="font-bold text-2xl text-text">Přidat cvik</Text>
					</View>

					<ExercisePicker onSelect={(id) => setSelectedId(id)} selectedId={selectedId} />

					<View className="mt-4 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl"
							disabled={selectedId === undefined}
							onPress={handleAddExercise}
							style={{
								backgroundColor:
									selectedId === undefined ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Ionicons color="white" name="add" size={28} />
							<Text className="p-2 font-semibold text-lg text-text">Přidat cvik</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
