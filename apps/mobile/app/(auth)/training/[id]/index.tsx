import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { NotebookPen, Share2 } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import Exercise from "@/components/trainings/exercise";
import TrainingFooter from "@/components/trainings/training-footer";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

export default function TrainingById() {
	const { id } = useLocalSearchParams();
	const [isEdit, setIsEdit] = useState(false);
	const workout = useQuery(api.workouts.getWorkoutById, {
		workoutId: id as Id<"workouts">,
	});

	if (!workout) {
		return null;
	}

	return (
		<>
			<View className="flex-1 bg-primary px-4 pt-2">
				<FlatList
					data={workout.exercises}
					ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
					keyExtractor={(item) => item._id}
					ListHeaderComponent={() => (
						<>
							<View className="mt-3 flex-row items-center gap-2">
								{workout.name !== "" && (
									<View className="max-w-1/2 flex-row items-center gap-2">
										<NotebookPen color={COLORS.muted} size={16} />
										<Text className="text-muted text-sm">{workout.name}</Text>
									</View>
								)}
								<Text className="ml-auto rounded-full bg-secondary px-3 py-1.5 text-sm text-text">
									Cviky: {workout.exercises.length}
								</Text>
								<Text
									className="rounded-xl border px-2.5 py-1.5 text-sm text-text"
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
								{workout.isShared && (
									<View className="h-7.5 w-7.5 items-center justify-center rounded-full bg-secondary pr-0.5">
										<Share2 className="" color={COLORS.muted} size={16} />
									</View>
								)}
							</View>
						</>
					)}
					renderItem={({ item }) =>
						item.exercise ? (
							<Exercise
								_id={item._id}
								exerciseId={item.exercise._id}
								exercisesLength={workout.exercises.length}
								isEdit={isEdit}
								muscleGroup={item.exercise.muscleGroup}
								name={item.exercise.name}
								note={item.note}
								order={item.order}
								sets={item.sets}
								trainingId={workout._id}
							/>
						) : null
					}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				/>
			</View>
			<TrainingFooter
				exercises={workout.exercises.length}
				id={workout._id}
				isEdit={isEdit}
				setIsEdit={setIsEdit}
			/>
		</>
	);
}
