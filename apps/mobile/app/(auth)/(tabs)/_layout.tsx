import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { COLORS } from "@/constants/COLORS";

export default function TabsLayout() {
	return (
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
							name={focused ? "home" : "home-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="trainings"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "list" : "list-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "add-circle" : "add-circle-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="stats"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "stats-chart" : "stats-chart-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
