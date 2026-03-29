import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Layers } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import CreateTrainingModal from "./create-training-modal";
import TrainingRoutineModal from "./training-routine-modal";

export default function MenuModal() {
	const selectNewTraining = () => {
		TrueSheet.present(NAMES.sheets.createTraining);
	};

	const selectRutina = () => {
		TrueSheet.present(NAMES.sheets.trainingRoutine);
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={["auto"]}
			dimmedDetentIndex={0.1}
			name={NAMES.sheets.createMenu}
		>
			<View className="px-4 pt-9 pb-12">
				<View className="justify-center gap-4">
					<Pressable
						className="flex flex-row items-center justify-center gap-2 rounded-2xl bg-secondary py-4.5"
						onPress={selectNewTraining}
					>
						<Ionicons color={COLORS.accent} name="add-circle-outline" size={28} />
						<Text className="font-semibold text-[19px] text-text">Nový trénink</Text>
					</Pressable>

					<Pressable
						className="flex flex-row items-center justify-center gap-3 rounded-2xl bg-secondary py-4.5"
						onPress={selectRutina}
					>
						<Layers color={COLORS.accent} size={28} />
						<Text className="font-semibold text-[19px] text-text">Podle rutiny</Text>
					</Pressable>
				</View>
			</View>

			<CreateTrainingModal />
			<TrainingRoutineModal />
		</TrueSheet>
	);
}
