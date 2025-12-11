import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { createContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import RoutineHeader from "@/components/routine/routine-header";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../../../packages/convex/convex/_generated/dataModel";

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

	if (routine === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!routine) {
		return null;
	}

	const filterColor = routine.filter?.color || COLORS.accent;

	return (
		<RoutineIdContext.Provider value={id}>
			<View className="flex-1 bg-primary">
				<View className="px-4">
					<RoutineHeader routineId={id as string} text={routine.name} />
				</View>

				<MaterialTopTabs
					screenOptions={{
						tabBarStyle: {
							backgroundColor: COLORS.primary,
							marginTop: -12,
						},
						tabBarActiveTintColor: filterColor,
						tabBarInactiveTintColor: "#999",
						tabBarIndicatorStyle: {
							backgroundColor: filterColor,
						},
						tabBarLabel: ({ focused, children }) => (
							<Text
								className={`${focused ? "" : "font-normal text-muted"} text-lg`}
								style={{ color: focused ? filterColor : "#999" }}
							>
								{children}
							</Text>
						),
					}}
				>
					<MaterialTopTabs.Screen name="index" options={{ title: "Cviky" }} />
					<MaterialTopTabs.Screen name="stats" options={{ title: "Stats" }} />
				</MaterialTopTabs>
			</View>
		</RoutineIdContext.Provider>
	);
}
