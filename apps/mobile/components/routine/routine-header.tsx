import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import EditRoutineModal from "./modals/edit-routine-modal";

export default function RoutineHeader({
	text,
	routineId,
	defaultFilterId,
}: {
	text: string;
	routineId: string;
	defaultFilterId: string;
}) {
	const router = useRouter();

	return (
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color={COLORS.accent} name="chevron-back" size={28} />
			</TouchableOpacity>
			<Text className="ml-2 flex-1 font-semibold text-text text-xl">{text}</Text>
			<TouchableOpacity className="w-8" onPress={() => TrueSheet.present(NAMES.sheets.editRoutine)}>
				<Pencil color="white" size={22} />
			</TouchableOpacity>
			<EditRoutineModal
				defaultFilterId={defaultFilterId}
				defaultName={text}
				routineId={routineId}
				sheetName={NAMES.sheets.editRoutine}
			/>
		</View>
	);
}
