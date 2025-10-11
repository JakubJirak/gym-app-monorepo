import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ComponentHeader({ text }: { text: string }) {
	const router = useRouter();

	return (
		<View className="flex-row items-center mt-2 pb-2 gap-6">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons name="chevron-back" size={28} color="white" />
			</TouchableOpacity>
			<Text className="text-white text-2xl font-semibold flex-1">{text}</Text>
		</View>
	);
}
