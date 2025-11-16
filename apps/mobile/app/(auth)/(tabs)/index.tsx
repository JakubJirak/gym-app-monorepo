import { Text, TouchableOpacity, View } from "react-native";
import { authClient } from "@/src/lib/auth-client";

export default function Index() {

	return (
		<View className="flex-1 bg-primary px-4">
			<Text className="text-text">
				uvitani, posledni treninky, typy a triky, nejake statistiky...
			</Text>
		</View>
	);
}
