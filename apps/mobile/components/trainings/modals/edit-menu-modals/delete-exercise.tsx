import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type DeleteWorkoutExerciseProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	workoutExerciseId: string;
	closeParent: () => void;
	trainingId: string;
	order: number;
};

export default function DeleteWorkoutExerciseModal({
	visible,
	setVisible,
	workoutExerciseId,
	closeParent,
	trainingId,
	order,
}: DeleteWorkoutExerciseProps) {
	const closeSheet = () => setVisible(false);
	const deleteWorkoutExercise = useMutation(api.workoutExercises.deleteWorkoutExercise);

	const handleDeleteExercise = () => {
		deleteWorkoutExercise({
			workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
			workoutId: trainingId as Id<"workouts">,
			order,
		});
		closeSheet();
		closeParent();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[33%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 items-center justify-between">
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="white" name="trash-outline" size={24} />
						<Text className="font-bold text-2xl text-text">Smazat cvik</Text>
					</View>

					<Text className="text-center text-muted">
						Tato akce se nedá navrátit. Navždy smaže cvik z tohoto tréninku včetně všech jeho
						sérií a poznámek.
					</Text>

					<View className="mt-4 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl bg-destructive"
							onPress={handleDeleteExercise}
						>
							<Ionicons color="white" name="trash-outline" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Smazat cvik</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
