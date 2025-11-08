import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../global.css";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "../src/lib/auth-client";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string, {
	// Optionally pause queries until the user is authenticated
	expectAuth: true,
	unsavedChangesWarning: false,
});

export default function RootLayout() {
	return (
		<ConvexProvider client={convex}>
			<ConvexBetterAuthProvider authClient={authClient} client={convex}>
				<PaperProvider>
					<StackLayout />
				</PaperProvider>
			</ConvexBetterAuthProvider>
		</ConvexProvider>
	);
}

function StackLayout() {
	//const isAuth = true;
	const { data: session } = authClient.useSession();
	// biome-ignore lint/complexity/noUselessTernary: guard needs boolean
	const isAuth = session ? true : false;

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
