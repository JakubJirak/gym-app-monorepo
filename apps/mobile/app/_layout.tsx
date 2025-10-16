import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../global.css";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "../src/lib/auth-client";

const convex = new ConvexReactClient(
	process.env.EXPO_PUBLIC_CONVEX_URL as string,
	{
		// Optionally pause queries until the user is authenticated
		expectAuth: true,
		unsavedChangesWarning: false,
	},
);

export default function RootLayout() {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<PaperProvider>
				<StackLayout />
			</PaperProvider>
		</ConvexBetterAuthProvider>
	);
}

function StackLayout() {
	//const isAuth = false;
	const { isAuthenticated: isAuth } = useConvexAuth();

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: COLORS.primary },
			}}
		>
			<Stack.Protected guard={isAuth}>
				<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			</Stack.Protected>
			<Stack.Protected guard={!isAuth}>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="sign-in" options={{ headerShown: false }} />
				<Stack.Screen name="sign-up" options={{ headerShown: false }} />
			</Stack.Protected>
		</Stack>
	);
}
