import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function TrainingHeader({ text }: { text: string }) {
	const router = useRouter();

	return (
		<View className="flex-row items-center mt-2 pb-4 pr-2">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons name="chevron-back" size={28} color="white" />
			</TouchableOpacity>
			<Text className="text-white text-2xl ml-4 font-semibold flex-1">
				{text}
			</Text>
			{/*<TouchableOpacity className="w-8">
				<Ionicons name="ellipsis-vertical" size={24} color="white" />
			</TouchableOpacity>*/}
		</View>
	);
}
