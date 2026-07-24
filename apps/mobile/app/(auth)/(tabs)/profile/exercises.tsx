import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddNewExerciseModal from "@/components/exercises/add-new-exercise";
import EditExerciseModal from "@/components/exercises/edit-exercise";
import Exercise from "@/components/exercises/exercise";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Exercises() {
	const groups = useQuery(api.exercises.getExerciseCatalogWithUsage);
	type ExerciseItem = (typeof api.exercises.getExerciseCatalogWithUsage._returnType)[number]["exercises"][number];
	const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

	const openEditExercise = (exercise: ExerciseItem) => {
		setSelectedExercise(exercise);
		requestAnimationFrame(() => TrueSheet.present(NAMES.sheets.editExercise));
	};

	if (groups === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1 bg-primary px-2">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Cviky" />
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-3.5"
				onPress={() => TrueSheet.present(NAMES.sheets.addNewExercise)}
			>
				<Plus color="white" size={32} />
			</TouchableOpacity>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="mx-2 mt-4 pb-20">
					{groups.map((group) => (
						<View className="mt-1 mb-2" key={group._id}>
							<Text className="mb-2 font-semibold text-lg text-text">{group.name}</Text>
							{group.exercises.map((exercise) => (
								<Exercise
									editable={exercise.editable}
									key={exercise._id}
									name={exercise.name}
									onPress={() => openEditExercise(exercise)}
									usageCount={exercise.usageCount}
								/>
							))}
						</View>
					))}
				</View>
			</ScrollView>

			<AddNewExerciseModal />
			{selectedExercise ? (
				<EditExerciseModal
					exerciseId={selectedExercise._id}
					exerciseName={selectedExercise.name}
					usageCount={selectedExercise.usageCount}
				/>
			) : null}
		</View>
	);
}
