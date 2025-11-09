import { useQuery } from "convex/react";
import { Dumbbell } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";
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
			<View className="mx-2 mt-4 gap-2">
				<View className="flex-row items-center gap-3">
					<Dumbbell color="white" size={28} />
					<Text className="font-bold text-text text-xl">Vaše</Text>
					<Text className="-ml-1.5 font-bold text-text text-xl">cviky</Text>
				</View>

				<Text className="text-base text-muted">
					Zde si můžete zobrazit a vytvořit nový cvik pro určinou svalovou partii!
				</Text>
			</View>
		</View>
	);
}
