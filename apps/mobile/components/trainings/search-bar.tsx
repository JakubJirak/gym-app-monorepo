import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

export default function SearchBar() {
	return (
		<View className="mt-2 mb-4 flex-row items-center gap-2 rounded-4xl bg-secondary px-4 py-1">
			<Ionicons color={COLORS.muted} name="search" size={24} />
			<TextInput
				className="flex-1 text-lg text-white caret-white"
				placeholder="Vyhledej trénink..."
				placeholderTextColorClassName="accent-muted"
			/>
		</View>
	);
}
