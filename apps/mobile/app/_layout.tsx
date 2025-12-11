import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
// biome-ignore lint/performance/noNamespaceImport: expo import
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "../global.css";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "../src/lib/auth-client";

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string, {
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
	const { data: session, isPending } = authClient.useSession();
	// biome-ignore lint/complexity/noUselessTernary: auth route boolean
	const isAuth = session ? true : false;

	useEffect(() => {
		if (!isPending) {
			SplashScreen.hideAsync();
		}
	}, [isPending]);

	// Keep splash screen visible while auth is loading
	if (isPending) {
		return null;
	}

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

/* 
FIXY PRO DALSI BUILD
- flashing klavesnice po vybrani cviku a otevrene klavesnici
- opravit flashovani vsech modalu nebo klavesnice
- opravit offset pro navigation buttons

FEATURES PRO DALSI BUILD
- pridat moznost vytvorit si rutinu
- pridat menu na vyber vytvoreni treninku pomoci rutiny nebo cviku
- pridat moznost sdilet trenink mezi uzivateli, popr. udelat si pratele
- pri vytvoreni treninku pomoci rutiny automaticky pridat posledni serie s danou vahou a opakovani
- lehci pridavani serii - mit + button kdyz nemam zadnou serii
- pridani profilovych fotek a jejich moznosti vyberu

DONE - FIX
- zmenseni paddingu, marginu v ukazovani serii a cviku, zmenseni fontu cviku
- muscleGroups butou mit vlastni modal, ne dialog
- pri vytvoreni noveho cviku pres menu ten cvik automaticky vybrat
- pridat optimistic rendering na vsechny queries

DONE - FEATURES
- pomoci textu pro pridani treninku se zobrazi modal na pridani treninku
- kliknuti na vaha nenastaveno presmeruje uzivatele na nastaveni vahy
*/
