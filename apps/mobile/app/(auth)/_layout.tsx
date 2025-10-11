import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";

export default function AuthLayout() {
	return (
		<>
			<SafeAreaView className="bg-primary" />
			<Stack
				screenOptions={{
					contentStyle: {
						backgroundColor: COLORS.primary,
					},
				}}
			>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="[id]" options={{ headerShown: false }} />
			</Stack>
		</>
	);
}
