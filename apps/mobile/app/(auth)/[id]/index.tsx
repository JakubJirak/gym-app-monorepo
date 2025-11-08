import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import Exercise from "@/components/trainings/exercise";
import TrainingFooter from "@/components/trainings/training-footer";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
//import {api} from "@packages/convex"

export default function TrainingById() {
	const { id } = useLocalSearchParams();
	const workout = useQuery(api.workouts.getWorkoutById, {
		workoutId: id as Id<"workouts">,
	});

	if (!workout) {
		return null;
	}

	return (
		<>
			<View className="flex-1 bg-primary px-5 pt-2">
				<FlatList
					data={workout.exercises}
					ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
					keyExtractor={(item) => item._id}
					ListHeaderComponent={() => (
						<View className="mt-3 flex-row items-center pb-4">
							<View className="flex-1 flex-row gap-2">
								<Ionicons color={COLORS.muted} name="calendar-outline" size={20} />
								<Text className="text-muted">
									{format(new Date(workout.workoutDate), "PPPP", {
										locale: cs,
									})}
								</Text>
							</View>
							<Text
								className={"rounded-xl border px-2.5 py-1.5 text-base text-white"}
								style={{
									borderColor: `${workout?.filter?.color}CC`,
									color: "white",
									borderRadius: 1200,
									paddingHorizontal: 10,
									paddingVertical: 4,
									borderWidth: 1,
									opacity: 0.9,
									fontSize: 14,
									fontWeight: "300",
								}}
							>
								{workout.filter?.name}
							</Text>
						</View>
					)}
					renderItem={({ item }) =>
						item.exercise ? (
							<Exercise
								muscleGroup={item.exercise.muscleGroup}
								name={item.exercise.name}
								note={item.note}
								sets={item.sets}
							/>
						) : null
					}
				/>
			</View>
      <TrainingFooter id={workout._id} exercises={workout.exercises.length} />
		</>
	);
}
