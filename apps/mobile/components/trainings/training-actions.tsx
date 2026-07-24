import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Pencil, Trash } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import DeleteTrainingModal from "./modals/delete-training";
import EditTrainingModal from "./modals/edit-training";

export type ActionWorkout = {
	_id: string;
	name: string;
	workoutDate: string;
	filterId: string | undefined;
};

type TrainingActionsProps = {
	menuPosition: { x: number; y: number };
	menuVisible: boolean;
	onClose: () => void;
	workout: ActionWorkout | null;
};

export default function TrainingActions({ menuPosition, menuVisible, onClose, workout }: TrainingActionsProps) {
	const editSheetName = workout ? `${NAMES.sheets.editTraining}-${workout._id}` : "";
	const deleteSheetName = workout ? `${NAMES.sheets.deleteTraining}-${workout._id}` : "";

	const openEdit = () => {
		if (!workout) {
			return;
		}
		onClose();
		TrueSheet.present(editSheetName);
	};

	const openDelete = () => {
		if (!workout) {
			return;
		}
		onClose();
		TrueSheet.present(deleteSheetName);
	};

	return (
		<>
			<Modal
				animationIn="fadeIn"
				animationOut="fadeOut"
				backdropOpacity={0.5}
				backdropTransitionOutTiming={0}
				hideModalContentWhileAnimating
				isVisible={menuVisible}
				onBackButtonPress={onClose}
				onBackdropPress={onClose}
				style={{
					margin: 0,
					position: "absolute",
					left: menuPosition.x,
					top: menuPosition.y + 50,
				}}
				useNativeDriver
				useNativeDriverForBackdrop
			>
				<View className="gap-2 rounded-xl bg-darker p-5">
					<TouchableOpacity className="flex-row items-center gap-3 rounded-lg" onPress={openEdit}>
						<Pencil color="white" size={18} />
						<Text className="text-lg text-text">Upravit trénink</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="mt-2 flex-row items-center gap-3 rounded-lg"
						onPress={openDelete}
					>
						<Trash color={COLORS.destructive} size={18} />
						<Text className="text-destructive text-lg">Smazat trénink</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{workout ? (
				<>
					<EditTrainingModal
						defaultDate={workout.workoutDate}
						defaultFilterId={workout.filterId}
						defaultName={workout.name}
						sheetName={editSheetName}
						trainingId={workout._id}
					/>
					<DeleteTrainingModal sheetName={deleteSheetName} trainingId={workout._id} />
				</>
			) : null}
		</>
	);
}
