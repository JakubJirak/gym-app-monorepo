import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import Exercise from "@/components/trainings/exercise";
import TrainingFooter from "@/components/trainings/training-footer";
import { COLORS } from "@/constants/COLORS";
import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
//import {api} from "@packages/convex"

export default function TrainingById() {
	const { id } = useLocalSearchParams();
	const workout = useQuery(api.workouts.getWorkoutById, {
		workoutId: id as Id<"workouts">,
	});

	if (!workout) return null;

	return (
		<>
			<View className="flex-1 bg-primary px-5 pt-2">
				<FlatList
					ListHeaderComponent={() => (
						<View className="flex-row items-center mt-4 pb-4">
							<View className="flex-row flex-1 gap-2">
								<Ionicons
									name="calendar-outline"
									size={20}
									color={COLORS.muted}
								/>
								<Text className="text-muted">
									{format(new Date(workout.workoutDate), "PPPP", {
										locale: cs,
									})}
								</Text>
							</View>
							<Text
								style={{
									// borderColor: workout.filter.color,
									color: "white",
									borderRadius: 12,
									paddingHorizontal: 10,
									paddingVertical: 6,
									borderWidth: 1,
									opacity: 0.9,
								}}
								className={`text-white border rounded-xl px-2.5 py-1.5 text-base`}
							>
								{workout.filter?.name}
							</Text>
						</View>
					)}
					data={workout.exercises}
					renderItem={({ item }) =>
						item.exercise ? (
							<Exercise
								name={item.exercise.name}
								muscleGroup={item.exercise.muscleGroup}
								sets={item.sets}
								note={item.note}
							/>
						) : null
					}
					keyExtractor={(item) => item._id}
					ItemSeparatorComponent={() => (
						<View className="w-full h-0.5 bg-secondary" />
					)}
				/>
			</View>
			<TrainingFooter id={workout._id} />
		</>
	);
}
