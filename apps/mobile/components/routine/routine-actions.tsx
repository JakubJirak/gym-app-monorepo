import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Pencil, Trash } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import DeleteRoutineModal from "./modals/delete-routine";
import EditRoutineModal from "./modals/edit-routine-modal";

export type ActionRoutine = {
	_id: string;
	name: string;
	filterId: string;
};

type RoutineActionsProps = {
	menuPosition: { x: number; y: number };
	menuVisible: boolean;
	onClose: () => void;
	routine: ActionRoutine | null;
};

export default function RoutineActions({ menuPosition, menuVisible, onClose, routine }: RoutineActionsProps) {
	const editSheetName = routine ? `${NAMES.sheets.editRoutine}-${routine._id}` : "";
	const deleteSheetName = routine ? `${NAMES.sheets.deleteRoutine}-${routine._id}` : "";

	const openEdit = () => {
		if (!routine) {
			return;
		}
		onClose();
		TrueSheet.present(editSheetName);
	};

	const openDelete = () => {
		if (!routine) {
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
						<Text className="text-lg text-text">Upravit rutinu</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="mt-2 flex-row items-center gap-3 rounded-lg"
						onPress={openDelete}
					>
						<Trash color={COLORS.destructive} size={18} />
						<Text className="text-destructive text-lg">Smazat rutinu</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{routine ? (
				<>
					<EditRoutineModal
						defaultFilterId={routine.filterId}
						defaultName={routine.name}
						routineId={routine._id}
						sheetName={editSheetName}
					/>
					<DeleteRoutineModal routineId={routine._id} sheetName={deleteSheetName} />
				</>
			) : null}
		</>
	);
}
