import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function TrainingHeader({ text }: { text: string }) {
	const router = useRouter();

	return (
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color="white" name="chevron-back" size={28} />
			</TouchableOpacity>
			<Text className="ml-4 flex-1 font-semibold text-2xl text-white">{text}</Text>
			{/*<TouchableOpacity className="w-8">
				<Ionicons name="ellipsis-vertical" size={24} color="white" />
			</TouchableOpacity>*/}
		</View>
	);
}
