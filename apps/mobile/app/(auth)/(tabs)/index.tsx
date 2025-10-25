import { authClient } from "@/src/lib/auth-client";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	const logOut = () => {
		authClient.signOut();
	};

	return (
		<View className="flex-1 bg-primary px-4">
			<Text className="text-white">
				domovska obrazovka, souhrny, posledni treninky, nejake statistiky...
			</Text>
			<TouchableOpacity onPress={logOut}>
				<Text className="text-white">Log Out</Text>
			</TouchableOpacity>
		</View>
	);
}
