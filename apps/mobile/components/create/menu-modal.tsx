import { Ionicons } from "@expo/vector-icons";
import { Layers } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import CreateTrainingModal from "./create-training-modal";
import TrainingRoutineModal from "./training-routine-modal";

type MenuModalProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
};

export default function MenuModal({ sheetVisible, setSheetVisible }: MenuModalProps) {
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [trainingRoutineModalVisible, setTrainingRoutineModalVisible] = useState(false);
	const closeSheet = () => setSheetVisible(false);

	const selectNewTraining = () => {
		setCreateModalVisible(true);
	};

	const selectRutina = () => {
		setTrainingRoutineModalVisible(true);
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
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
			<View className="h-[35%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-center gap-4">
					<Pressable
						className="boder-accent mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary py-4"
						onPress={selectNewTraining}
					>
						<Ionicons color={COLORS.accent} name="add-circle-outline" size={40} />
						<Text className="font-semibold text-text text-xl">Nový trénink</Text>
					</Pressable>

					<Pressable
						className="mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary px-12 py-5"
						onPress={selectRutina}
					>
						<Layers color={COLORS.accent} size={36} />
						<Text className="font-semibold text-text text-xl">Podle rutiny</Text>
					</Pressable>
				</View>
			</View>

			<CreateTrainingModal
				closeParentSheet={closeSheet}
				createModalVisible={createModalVisible}
				setCreateModalVisible={setCreateModalVisible}
			/>
			<TrainingRoutineModal
				closeParentSheet={closeSheet}
				setTrainingRoutineModalVisible={setTrainingRoutineModalVisible}
				trainingRoutineModalVisible={trainingRoutineModalVisible}
			/>
		</Modal>
	);
}
