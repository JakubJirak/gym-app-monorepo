import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import { ExercisePicker } from "../forms/exercise-picker";
import DeleteTrainingModal from "./modals/delete-training";

type TrainingFooterProps = {
	id: string;
	exercises: number;
	isEdit: boolean;
	setIsEdit: (isEdit: boolean) => void;
};

export default function TrainingFooter({ id, exercises, isEdit, setIsEdit }: TrainingFooterProps) {
	const [deleteModal, setDeleteModal] = useState(false);
	const [addExerciseModal, setAddExerciseModal] = useState(false);
	const addExercise = useMutation(api.workoutExercises.addWorkoutExercise);

	const handleExerciseSelect = (exerciseId: string) => {
		addExercise({
			workoutId: id as Id<"workouts">,
			exerciseId: exerciseId as Id<"exercises">,
			order: exercises,
		});
	};

	return (
		<View className="h-[72px] flex-row items-center border-[#1a1a1a] border-t bg-darker pr-2 pb-8">
			{/* <TouchableOpacity className="flex w-1/4 items-center pt-2">
				<Ionicons color="white" name="share-social-outline" size={24} />
			</TouchableOpacity> */}
			<TouchableOpacity className="flex w-1/3 items-center pt-2" onPress={() => setDeleteModal(true)}>
				<Ionicons color="white" name="trash-outline" size={24} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/3 items-center pt-2" onPress={() => setAddExerciseModal(true)}>
				<Ionicons color="white" name="add-outline" size={32} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/3 items-center pt-2" onPress={() => setIsEdit(!isEdit)}>
				<Pencil color={isEdit ? COLORS.accent : "white"} size={22} />
			</TouchableOpacity>

			<DeleteTrainingModal setSheetVisible={setDeleteModal} sheetVisible={deleteModal} trainingId={id} />
			<ExercisePicker
				onSelect={handleExerciseSelect}
				setVisible={setAddExerciseModal}
				standalone
				visible={addExerciseModal}
			/>
		</View>
	);
}
