import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import CreateTrainingModal from "@/components/create/create-training-modal";
import MenuModal from "@/components/create/menu-modal";
import TrainingRoutineModal from "@/components/create/training-routine-modal";
import { COLORS } from "@/constants/COLORS";

export default function TabsLayout() {
	const [sheetVisible, setSheetVisible] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [trainingRoutineModalVisible, setTrainingRoutineModalVisible] = useState(false);
	const openSheet = () => setCreateModalVisible(true);

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

			<MenuModal
				setCreateModalVisible={setCreateModalVisible}
				setSheetVisible={setSheetVisible}
				setTrainingRoutineModalVisible={setTrainingRoutineModalVisible}
				sheetVisible={sheetVisible}
			/>
			<CreateTrainingModal
				createModalVisible={createModalVisible}
				setCreateModalVisible={setCreateModalVisible}
			/>
			<TrainingRoutineModal
				setTrainingRoutineModalVisible={setTrainingRoutineModalVisible}
				trainingRoutineModalVisible={trainingRoutineModalVisible}
			/>
		</>
	);
}
