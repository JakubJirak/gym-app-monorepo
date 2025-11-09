import { Ionicons } from "@expo/vector-icons";
import { Layers } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";

type TrainingRoutineModalProps = {
	trainingRoutineModalVisible: boolean;
	setTrainingRoutineModalVisible: (visible: boolean) => void;
};

export default function TrainingRoutineModal({
	trainingRoutineModalVisible,
	setTrainingRoutineModalVisible,
}: TrainingRoutineModalProps) {
	const closeSheet = () => setTrainingRoutineModalVisible(false);

	const onSelect = (opt: string) => {
		console.log("Vybraná možnost:", opt);
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={trainingRoutineModalVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[50%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-center gap-4">
					<Pressable
						className="boder-accent mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary py-4"
						onPress={() => onSelect("novy")}
					>
						<Ionicons color={COLORS.accent} name="add-circle-outline" size={40} />
						<Text className="font-semibold text-text text-xl">Nový trénink</Text>
					</Pressable>

					<Pressable
						className="mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary px-12 py-5"
						onPress={() => onSelect("rutina")}
					>
						<Layers color={COLORS.accent} size={36} />
						<Text className="font-semibold text-text text-xl">Podle rutiny</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
