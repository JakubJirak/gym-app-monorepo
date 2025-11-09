import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { createContext } from "react";
import { Text, View } from "react-native";
import TrainingHeader from "@/components/trainings/training-header";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

export const TrainingIdContext = createContext<string | string[] | undefined>(undefined);

export default function TrainingIdLayout() {
	const { id } = useLocalSearchParams();
	let workout;

	try {
		workout = useQuery(api.workouts.getWorkoutById, {
			workoutId: id as Id<"workouts">,
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		workout = null;
	}

	if (!workout) {
		return null;
	}

	return (
		<TrainingIdContext.Provider value={id}>
			<View className="flex-1">
				<View className="px-4">
					<TrainingHeader text={workout.name} />
				</View>

				<MaterialTopTabs
					screenOptions={{
						tabBarStyle: {
							backgroundColor: COLORS.primary,
							marginTop: -12,
						},
						tabBarActiveTintColor: COLORS.accent,
						tabBarInactiveTintColor: "#999",
						tabBarIndicatorStyle: {
							backgroundColor: COLORS.accent,
						},
						tabBarLabel: ({ focused, children }) => (
							<Text
								className={`${focused ? "font-bold text-accent" : "font-normal text-muted"} text-lg`}
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
		</TrainingIdContext.Provider>
	);
}
