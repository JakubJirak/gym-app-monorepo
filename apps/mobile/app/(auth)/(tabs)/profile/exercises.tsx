import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddNewExerciseModal from "@/components/exercises/add-new-exercise";
import Exercise from "@/components/exercises/exercise";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

type ExerciseType = {
	_id: string;
	name: string;
	muscleGroup: string;
};

type SortedExercises = {
	[muscleGroup: string]: ExerciseType[];
};

export default function Exercises() {
	const exercises = useQuery(api.exercises.getAllExercises);
	const [addExercise, setAddExercise] = useState(false);

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
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-2"
				onPress={() => setAddExercise(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>
			<ScrollView>
				<View className="mx-2 mt-4 gap-2 pb-20">
					{/*<View className="flex-row items-center gap-3">
						<Dumbbell color="white" size={28} />
						<Text className="font-bold text-text text-xl">Vaše</Text>
						<Text className="-ml-1.5 font-bold text-text text-xl">cviky</Text>
					</View>

					<Text className="text-base text-muted">
						Zde si můžete zobrazit a vytvořit nový cvik pro určinou svalovou partii!
					</Text>*/}

					{Object.entries(sortedExercisesByLength).map(([muscleGroup, ex]) => (
						<View className="mt-1 mb-4" key={muscleGroup}>
							<Text className="mb-2 font-semibold text-lg text-text">{muscleGroup}</Text>
							{ex.map((exercise) => (
								<Exercise
									exerciseId={exercise._id}
									key={exercise._id}
									name={exercise.name}
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
