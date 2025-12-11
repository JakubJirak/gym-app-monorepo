import { Ionicons } from "@expo/vector-icons";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import DeleteRoutineModal from "./modals/delete-routine";
import RoutineAddExerciseModal from "./modals/routine-add-exercise";

type RoutineFooterProps = {
	id: string;
	exercises: number;
	isEdit: boolean;
	setIsEdit: (isEdit: boolean) => void;
};

export default function RoutineFooter({ id, exercises, isEdit, setIsEdit }: RoutineFooterProps) {
	const [deleteModal, setDeleteModal] = useState(false);
	const [addExerciseModal, setAddExerciseModal] = useState(false);

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

			<RoutineAddExerciseModal
				exercises={exercises}
				routineId={id}
				setSheetVisible={setAddExerciseModal}
				sheetVisible={addExerciseModal}
			/>

			<DeleteRoutineModal routineId={id} setSheetVisible={setDeleteModal} sheetVisible={deleteModal} />
		</View>
	);
}
