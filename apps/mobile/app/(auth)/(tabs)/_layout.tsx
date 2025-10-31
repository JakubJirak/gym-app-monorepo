import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Layers } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";

export default function TabsLayout() {
	const [sheetVisible, setSheetVisible] = useState(false);

	const openSheet = () => setSheetVisible(true);
	const closeSheet = () => setSheetVisible(false);

	const onSelect = (opt: string) => {
		console.log("Vybráno:", opt);
		// tady můžeš zavolat router.push(...) nebo další akci
		closeSheet();
	};

	return (
		<>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: COLORS.accent,
					tabBarInactiveTintColor: COLORS.inactive,
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: "#0a0a0a",
						borderTopColor: "#1a1a1a",
						borderTopWidth: 1,
						shadowColor: "transparent",
						height: 72,
						paddingTop: 6,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								color={color}
								name={focused ? "home" : "home-outline"}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="trainings"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								color={color}
								name={focused ? "list" : "list-outline"}
								size={size}
							/>
						),
					}}
				/>

				{/* Create tab: použijeme listener, aby se navigace preventovala a otevřel sheet */}
				<Tabs.Screen
					listeners={{
						tabPress: (e) => {
							e.preventDefault();
							openSheet();
						},
					}}
					name="create"
					options={{
						tabBarIcon: ({ color, size }) => (
							// ikona zůstane jednoduchá; vizuální FAB můžeme docílit přes custom tabBarButton,
							// zde zachováme default layout a použijeme listener (čistší integrace)
							<Ionicons color={color} name="add-circle-outline" size={28} />
						),
						tabBarShowLabel: false,
					}}
				/>

				<Tabs.Screen
					name="stats"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								color={color}
								name={focused ? "stats-chart" : "stats-chart-outline"}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								color={color}
								name={focused ? "person" : "person-outline"}
								size={size}
							/>
						),
					}}
				/>
			</Tabs>

			{/* Half-sheet modal */}
			<Modal
				animationIn="slideInUp"
				animationOut="slideOutDown"
				isVisible={sheetVisible}
				// react-native-modal styl se musí stále předat jako JS objekt
				onBackButtonPress={closeSheet}
				onBackdropPress={closeSheet}
				onSwipeComplete={closeSheet}
				propagateSwipe
				style={{ justifyContent: "flex-end", margin: 0 }}
				swipeDirection={["down"]}
				useNativeDriver
			>
				<View
					// tady používáme tailwind-like className přes uniwind
					// výška 1/2 obrazovky => h-1/2, pozadí bílé, zaoblené rohy nahoře, padding
					className="h-[35%] rounded-t-lg bg-[#0a0a0a] p-4"
				>
					{/* handle */}
					<View className="mb-2 h-1 w-10 self-center rounded-full bg-muted" />

					<View className="flex-1 justify-center gap-4">
						<Pressable
							className="boder-accent mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary py-4"
							onPress={() => onSelect("novy")}
						>
							<Ionicons color={COLORS.accent} name="add-circle-outline" size={40} />
							<Text className="font-semibold text-white text-xl">Nový trénink</Text>
						</Pressable>

						<Pressable
							className="mx-4 flex flex-row items-center justify-center gap-4 rounded-2xl bg-secondary px-12 py-5"
							onPress={() => onSelect("rutina")}
						>
							<Layers color={COLORS.accent} size={36} />
							<Text className="font-semibold text-white text-xl">Podle rutiny</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</>
	);
}
