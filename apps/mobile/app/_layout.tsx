import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "../src/lib/auth-client";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string, {
  // Optionally pause queries until the user is authenticated
    expectAuth: true,
    unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
      </ConvexProvider>
    </ConvexBetterAuthProvider>
  );
}
