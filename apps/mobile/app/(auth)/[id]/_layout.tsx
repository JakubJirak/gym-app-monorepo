import {
	createMaterialTopTabNavigator,
	type MaterialTopTabNavigationEventMap,
	type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { format } from "date-fns/format";
import { cs } from "date-fns/locale/cs";
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
	// biome-ignore lint/suspicious/noImplicitAnyLet: valid
	// biome-ignore lint/suspicious/noEvolvingTypes: valid
	let workout;

	try {
		// biome-ignore lint/correctness/useHookAtTopLevel: zabezpeceni proti spatnemu id
		workout = useQuery(api.workouts.getWorkoutById, {
			workoutId: id as Id<"workouts">,
		});
	} catch (_) {
		workout = null;
	}

	if (!workout) {
		return null;
	}

	const filterColor = workout.filter?.color || COLORS.accent;

	return (
		<TrainingIdContext.Provider value={id}>
			<View className="flex-1">
				<View className="px-4">
					<TrainingHeader
						text={format(new Date(workout.workoutDate), "dd.MM.yyyy", { locale: cs })}
						trainingId={id as string}
					/>
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
		</TrainingIdContext.Provider>
	);
}
