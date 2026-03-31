import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type ComponentHeaderProps = {
	text: string;
	fallbackRoute?: string;
};

export default function ComponentHeader({ text, fallbackRoute }: ComponentHeaderProps) {
	const router = useRouter();

	const handleBack = () => {
		if (fallbackRoute) {
			// biome-ignore lint/suspicious/noExplicitAny: route.push requires 'any' type here
			router.push(fallbackRoute as any);
		} else if (router.canGoBack()) {
			router.back();
		}
	};

	return (
		<View className="mt-1 flex-row items-center gap-2 pb-2">
			<TouchableOpacity className="w-8" onPress={handleBack}>
				<Ionicons color={COLORS.accent} name="chevron-back" size={24} />
			</TouchableOpacity>
			<Text className="flex-1 font-semibold text-text text-xl">{text}</Text>
		</View>
	);
}
