import { useQuery } from "convex/react";
import { useMemo } from "react";
import { View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

type Exercise = {
	_id: string;
	name: string;
	muscleGroup: string;
};

type SortedExercises = {
	[muscleGroup: string]: Exercise[];
};

export default function Exercises() {
	const exercises = useQuery(api.exercises.getAllExercises);

	const sortedExercises = useMemo<SortedExercises>(
		() =>
			(exercises ?? []).reduce<SortedExercises>((acc, exercise) => {
				if (!acc[exercise.muscleGroup]) {
					acc[exercise.muscleGroup] = [];
				}
				acc[exercise.muscleGroup].push(exercise);
				return acc;
			}, {}),
		[exercises]
	);

	if (!exercises || exercises === undefined) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Cviky" />
		</View>
	);
}
