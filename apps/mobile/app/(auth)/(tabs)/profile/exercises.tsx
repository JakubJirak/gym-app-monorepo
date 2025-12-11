import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddNewExerciseModal from "@/components/exercises/add-new-exercise";
import Exercise from "@/components/exercises/exercise";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

type ExerciseType = {
	_id: string;
	name: string;
	muscleGroup: string | null;
	userId: string;
};

type SortedExercises = {
	[muscleGroup: string]: ExerciseType[];
};

export default function Exercises() {
	const exercises = useQuery(api.exercises.getAllExercises);
	const workouts = useQuery(api.workouts.getUserWorkouts);
	const [addExercise, setAddExercise] = useState(false);

	const exerciseUsageCount = useMemo(() => {
		if (!workouts) {
			return {};
		}
		return workouts
			.flatMap((workout) => workout.exercises)
			.reduce<Record<string, number>>((acc, workoutExercise) => {
				if (workoutExercise.exercise?._id) {
					acc[workoutExercise.exercise._id] = (acc[workoutExercise.exercise._id] || 0) + 1;
				}
				return acc;
			}, {});
	}, [workouts]);

	const sortedExercises = useMemo<SortedExercises>(
		() =>
			(exercises ?? []).reduce<SortedExercises>((acc, exercise) => {
				const muscleGroup = exercise.muscleGroup || "Nezařazeno";
				if (!acc[muscleGroup]) {
					acc[muscleGroup] = [];
				}
				acc[muscleGroup].push(exercise);
				return acc;
			}, {}),
		[exercises]
	);

	const sortedExercisesEntries = Object.entries(sortedExercises).sort(
		([, exercisesA], [, exercisesB]) => exercisesB.length - exercisesA.length
	);

	const sortedExercisesByLength = Object.fromEntries(sortedExercisesEntries);

	if (exercises === undefined || workouts === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (exercises === null || workouts === null) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-2">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Cviky" />
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-2"
				onPress={() => setAddExercise(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="mx-2 mt-4 pb-20">
					{Object.entries(sortedExercisesByLength).map(([muscleGroup, ex]) => (
						<View className="mt-1 mb-2" key={muscleGroup}>
							<Text className="mb-1 font-semibold text-lg text-text">{muscleGroup}</Text>
							{ex.map((exercise) => (
								<Exercise
									exerciseId={exercise._id}
									key={exercise._id}
									name={exercise.name}
									usageCount={exerciseUsageCount[exercise._id] || 0}
									userId={exercise.userId}
								/>
							))}
						</View>
					))}
				</View>
			</ScrollView>

			<AddNewExerciseModal setSheetVisible={setAddExercise} sheetVisible={addExercise} />
		</View>
	);
}
