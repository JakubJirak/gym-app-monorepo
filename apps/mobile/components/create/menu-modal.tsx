import { Ionicons } from "@expo/vector-icons";
import { Layers } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";

type MenuModalProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	setCreateModalVisible: (visible: boolean) => void;
	setTrainingRoutineModalVisible: (visible: boolean) => void;
};

export default function MenuModal({
	sheetVisible,
	setSheetVisible,
	setCreateModalVisible,
	setTrainingRoutineModalVisible,
}: MenuModalProps) {
	const closeSheet = () => setSheetVisible(false);

	const selectNewTraining = () => {
		setCreateModalVisible(true);
		closeSheet();
	};

	const selectRutina = () => {
		setTrainingRoutineModalVisible(true);
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[35%] rounded-t-lg bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-center gap-4">
					<Pressable
						className="boder-accent mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary py-4"
						onPress={selectNewTraining}
					>
						<Ionicons color={COLORS.accent} name="add-circle-outline" size={40} />
						<Text className="font-semibold text-white text-xl">Nový trénink</Text>
					</Pressable>

					<Pressable
						className="mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary px-12 py-5"
						onPress={selectRutina}
					>
						<Layers color={COLORS.accent} size={36} />
						<Text className="font-semibold text-white text-xl">Podle rutiny</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
