import { Ionicons } from "@expo/vector-icons";
import { Dumbbell } from "lucide-react-native";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

export default function EmptyTrainings() {
	return (
		<View className="gap-3">
			<View className="mb-1 flex-row items-center gap-2">
				<Dumbbell color={COLORS.accent} size={20} />
				<Text className="font-semibold text-text text-xl">Poslední trénink</Text>
			</View>
			<View className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-5 py-4">
				<Text className="text-base text-muted">Přidejte trénink pomocí tlačítka</Text>
				<Ionicons color={COLORS.muted} name="add-circle-outline" size={24} />
			</View>
		</View>
	);
}
