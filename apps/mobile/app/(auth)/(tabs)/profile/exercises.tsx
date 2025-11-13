import { useQuery } from "convex/react";
import { Dumbbell } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
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

	const sortedExercisesEntries = Object.entries(sortedExercises).sort(
		([, exercisesA], [, exercisesB]) => exercisesB.length - exercisesA.length
	);

	const sortedExercisesByLength = Object.fromEntries(sortedExercisesEntries);

	if (!exercises || exercises === undefined) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-3">
			<ComponentHeader text="Cviky" />
			<ScrollView>
				<View className="mx-2 mt-4 gap-2">
					<View className="flex-row items-center gap-3">
						<Dumbbell color="white" size={28} />
						<Text className="font-bold text-text text-xl">Vaše</Text>
						<Text className="-ml-1.5 font-bold text-text text-xl">cviky</Text>
					</View>

					<Text className="text-base text-muted">
						Zde si můžete zobrazit a vytvořit nový cvik pro určinou svalovou partii!
					</Text>

					{Object.entries(sortedExercisesByLength).map(([muscleGroup, ex]) => (
						<View className="mt-1 mb-4" key={muscleGroup}>
							<Text className="mb-2 font-semibold text-lg text-text">{muscleGroup}</Text>
							{ex.map((exercise) => (
								<View
									className="mb-2 rounded-xl bg-secondary px-4 py-3"
									key={exercise._id}
								>
									<Text className="text-base text-text">{exercise.name}</Text>
								</View>
							))}
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
