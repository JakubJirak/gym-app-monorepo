import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { ExercisePicker } from "@/components/forms/exercise-picker";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	routineExerciseId: string;
	closeParent: () => void;
};

export default function EditExerciseModal({ visible, setVisible, routineExerciseId, closeParent }: EditExerciseProps) {
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const closeSheet = () => setVisible(false);
	const editExercise = useMutation(api.routineExercises.editExercise).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		const allExercises = localStore.getQuery(api.exercises.getAllExercises, {});

		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises && allExercises) {
				const exerciseData = allExercises.find((ex) => ex._id === args.exerciseId);
				const updatedExercises = currentData.exercises.map((exercise) =>
					exercise._id === args.routineExerciseId
						? { ...exercise, exercise: exerciseData || null }
						: exercise
				);
				localStore.setQuery(api.routines.getRoutineById, query.args, {
					...currentData,
					exercises: updatedExercises,
				});
			}
		}
	});

	const handleEditExercise = () => {
		if (selectedId !== undefined) {
			editExercise({
				routineExerciseId: routineExerciseId as Id<"routinesExercises">,
				exerciseId: selectedId as Id<"exercises">,
			});
			setSelectedId(undefined);
			closeSheet();
			closeParent();
		}
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			hideModalContentWhileAnimating
			isVisible={visible}
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
						<Pencil color="white" size={20} />
						<Text className="font-bold text-2xl text-text">Změnit cvik</Text>
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
							onPress={handleEditExercise}
							style={{
								backgroundColor:
									selectedId === undefined ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Změnit cvik</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
