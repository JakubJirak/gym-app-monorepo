import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

export default function ComponentHeader({ text }: { text: string }) {
	const router = useRouter();

	return (
		<View className="mt-2 flex-row items-center gap-6 pb-2">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color={COLORS.accent} name="chevron-back" size={28} />
			</TouchableOpacity>
			<Text className="flex-1 font-semibold text-2xl text-text">{text}</Text>
		</View>
	);
}
