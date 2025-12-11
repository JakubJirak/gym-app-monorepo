import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, withLayoutContext } from "expo-router";
import { createContext } from "react";
import { ActivityIndicator, View } from "react-native";
import RoutineHeader from "@/components/routine/routine-header";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

export const RoutineIdContext = createContext<string | string[] | undefined>(undefined);

export default function RoutineIdLayout() {
	const { id } = useLocalSearchParams();
	const routine = useQuery(api.routines.getRoutineById, id ? { routineId: id as Id<"routines"> } : "skip");

	const filterColor = routine?.filter?.color || COLORS.accent;

	if (routine === undefined) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<View className="flex-1 items-center justify-center bg-primary">
					<ActivityIndicator color={COLORS.accent} size="large" />
				</View>
			</>
		);
	}

	if (!routine) {
		return <Stack.Screen options={{ headerShown: false }} />;
	}

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<RoutineIdContext.Provider value={id}>
				<View className="flex-1 bg-primary">
					<View className="px-4">
						<RoutineHeader routineId={id as string} text={routine.name} />
					</View>

					<MaterialTopTabs
						initialRouteName="index"
						screenOptions={{
							lazy: true,
							lazyPreloadDistance: 1,
							swipeEnabled: true,
							tabBarStyle: {
								backgroundColor: COLORS.primary,
								marginTop: -12,
								elevation: 0,
							},
							tabBarActiveTintColor: filterColor,
							tabBarInactiveTintColor: "#999",
							tabBarIndicatorStyle: {
								backgroundColor: filterColor,
								height: 2,
							},
							tabBarLabelStyle: {
								fontSize: 18,
								textTransform: "none",
								fontWeight: "600",
							},
							tabBarPressColor: "transparent",
						}}
					>
						<MaterialTopTabs.Screen name="index" options={{ title: "Cviky" }} />
						<MaterialTopTabs.Screen name="stats" options={{ title: "Stats" }} />
					</MaterialTopTabs>
				</View>
			</RoutineIdContext.Provider>
		</>
	);
}
