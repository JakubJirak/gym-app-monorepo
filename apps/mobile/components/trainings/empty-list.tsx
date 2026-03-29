import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";

export default function EmptyList() {
	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={() => {
				TrueSheet.present(NAMES.sheets.createMenu);
			}}
		>
			<View className="w-full items-center justify-center py-8">
				<Text className="text-base text-muted">Žádné tréninky</Text>
				<View className="mt-6 w-full flex-row items-center justify-center gap-2">
					<Text className="text-base text-muted">Přidejte trénink pomocí tlačítka</Text>
					<Ionicons color={COLORS.muted} name="add-circle-outline" size={24} />
				</View>
			</View>
		</TouchableOpacity>
	);
}
