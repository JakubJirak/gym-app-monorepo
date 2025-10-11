import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

export default function SearchBar() {
	return (
		<View className="bg-secondary flex-row items-center rounded-4xl px-4 py-1 mt-2 mb-4 gap-2">
			<Ionicons name="search" size={24} color={COLORS.muted} />
			<TextInput
				placeholder="Vyhledej trénink..."
				className="flex-1 placeholder:text-muted text-xl text-white caret-white"
			/>
		</View>
	);
}
