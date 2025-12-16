import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import MenuModal from "@/components/create/menu-modal";
import { COLORS } from "@/constants/COLORS";

export default function TabsLayout() {
	const [sheetVisible, setSheetVisible] = useState(false);
	const openSheet = () => setSheetVisible(true);

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
					sceneStyle: {
						backgroundColor: COLORS.primary,
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

				<Tabs.Screen
					listeners={{
						tabPress: (e) => {
							e.preventDefault();
							openSheet();
						},
					}}
					name="create"
					options={{
						tabBarIcon: ({ color }) => (
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

			<MenuModal setSheetVisible={setSheetVisible} sheetVisible={sheetVisible} />
		</>
	);
}
