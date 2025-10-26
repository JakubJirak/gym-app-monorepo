import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type {
	ParamListBase,
	TabNavigationState,
} from "@react-navigation/native";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { createContext } from "react";
import { View } from "react-native";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { useQuery } from "convex/react";
import TrainingHeader from "@/components/trainings/training-header";
import { COLORS } from "@/constants/COLORS";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

export const TrainingIdContext = createContext<string | string[] | undefined>(
	undefined,
);

export default function TrainingIdLayout() {
	const { id } = useLocalSearchParams();
	const workout = useQuery(api.workouts.getWorkoutById, {
		workoutId: id as Id<"workouts">,
	});

	if (!workout) return null;

	return (
		// @ts-ignore - not an valid error, context provider works fine
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
					}}
				>
					<MaterialTopTabs.Screen name="index" options={{ title: "Cviky" }} />
					<MaterialTopTabs.Screen name="stats" options={{ title: "Stats" }} />
				</MaterialTopTabs>

				{/*<TrainingFooter id={training.id} />*/}
			</View>
		</TrainingIdContext.Provider>
	);
}
