import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { format } from "date-fns/format";
import { cs } from "date-fns/locale/cs";
import { Stack, useLocalSearchParams, withLayoutContext } from "expo-router";
import { createContext } from "react";
import { ActivityIndicator, View } from "react-native";
import TrainingHeader from "@/components/trainings/training-header";
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

export const TrainingIdContext = createContext<string | string[] | undefined>(undefined);

export default function TrainingIdLayout() {
	const { id } = useLocalSearchParams();
	const workout = useQuery(api.workouts.getWorkoutById, id ? { workoutId: id as Id<"workouts"> } : "skip");

	if (workout === undefined) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<View className="flex-1 items-center justify-center bg-primary">
					<ActivityIndicator color={COLORS.accent} size="large" />
				</View>
			</>
		);
	}

	if (!workout) {
		return <Stack.Screen options={{ headerShown: false }} />;
	}

	const filterColor = workout.filter?.color || COLORS.accent;

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<TrainingIdContext.Provider value={id}>
				<View className="flex-1 bg-primary">
					<View className="px-4">
						<TrainingHeader
							text={format(new Date(workout.workoutDate), "dd.MM.yyyy", { locale: cs })}
							trainingId={id as string}
						/>
					</View>

					<MaterialTopTabs
						initialRouteName="index"
						screenOptions={{
							lazy: true,
							lazyPreloadDistance: 1,
							swipeEnabled: true,
							animationEnabled: false,
							tabBarStyle: {
								backgroundColor: COLORS.primary,
								marginTop: -12,
								elevation: 0,
								height: 48,
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
							tabBarBounces: false,
						}}
					>
						<MaterialTopTabs.Screen name="index" options={{ title: "Cviky" }} />
						<MaterialTopTabs.Screen name="stats" options={{ title: "Stats" }} />
					</MaterialTopTabs>
				</View>
			</TrainingIdContext.Provider>
		</>
	);
}
