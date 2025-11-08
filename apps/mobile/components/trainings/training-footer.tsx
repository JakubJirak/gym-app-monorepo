import { Ionicons } from "@expo/vector-icons";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AddExerciseModal from "./modals/add-exercise";
import DeleteTrainingModal from "./modals/delete-training";

export default function TrainingFooter({ id, exercises }: { id: string; exercises: number }) {
	const [deleteModal, setDeleteModal] = useState(false);
	const [addExerciseModal, setAddExerciseModal] = useState(false);

	const stopid = () => {
		console.log(id);
	};

	return (
		<View className="h-[72px] flex-row items-center border-[#1a1a1a] border-t bg-darker pr-2 pb-8">
			<TouchableOpacity className="flex w-1/4 items-center pt-2" onPress={stopid}>
				<Ionicons color="white" name="share-social-outline" size={24} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2" onPress={() => setAddExerciseModal(true)}>
				<Ionicons color="white" name="add-outline" size={32} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2">
				<Pencil color="white" size={22} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2" onPress={() => setDeleteModal(true)}>
				<Ionicons color="white" name="trash-outline" size={24} />
			</TouchableOpacity>

			<DeleteTrainingModal setSheetVisible={setDeleteModal} sheetVisible={deleteModal} trainingId={id} />
			<AddExerciseModal
				exercises={exercises}
				setSheetVisible={setAddExerciseModal}
				sheetVisible={addExerciseModal}
				trainingId={id}
			/>
		</View>
	);
}
