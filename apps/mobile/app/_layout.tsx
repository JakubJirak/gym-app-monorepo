import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "../src/lib/auth-client";
import "../global.css";
import { COLORS } from "@/constants/COLORS";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string, {
  // Optionally pause queries until the user is authenticated
    expectAuth: true,
    unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <ConvexProvider client={convex}>
        <PaperProvider>
          <SafeAreaProvider>
            <StackLayout />
          </SafeAreaProvider>
        </PaperProvider>
      </ConvexProvider>
    </ConvexBetterAuthProvider>
  );
}

function StackLayout() {
	const isAuth = true;

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
