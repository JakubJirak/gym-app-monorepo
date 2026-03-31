import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ExercisePicker } from "@/components/forms/exercise-picker";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type AddExerciseProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	trainingId: string;
	exercises: number;
};

export default function AddExerciseModal({ sheetVisible, setSheetVisible, trainingId, exercises }: AddExerciseProps) {
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const name = `${NAMES.sheets.trainingAddExercise}-${trainingId}`;
	const closeSheet = () => setSheetVisible(false);

	useEffect(() => {
		if (sheetVisible) {
			TrueSheet.present(name);
		} else {
			TrueSheet.dismiss(name);
		}
	}, [name, sheetVisible]);
	const addExercise = useMutation(api.workoutExercises.addWorkoutExercise).withOptimisticUpdate(
		(localStore, args) => {
			const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
			const allExercises = localStore.getQuery(api.exercises.getAllExercises, {});

			for (const query of queries) {
				const currentData = query.value;
				if (currentData && query.args.workoutId === args.workoutId && allExercises) {
					const exerciseData = allExercises.find((ex) => ex._id === args.exerciseId);

					const optimisticExercise = {
						_id: `temp-${Date.now()}` as Id<"workoutExercises">,
						exercise: exerciseData || null,
						note: undefined,
						sets: [],
						order: args.order,
						workoutId: args.workoutId,
					};
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...currentData,
						exercises: [...currentData.exercises, optimisticExercise],
					});
				}
			}
		}
	);

	const handleAddExercise = () => {
		if (selectedId !== undefined) {
			addExercise({
				workoutId: trainingId as Id<"workouts">,
				exerciseId: selectedId as Id<"exercises">,
				order: exercises,
			});
		}
		setSelectedId(undefined);
		closeSheet();
	};

	const handleExerciseSelect = (id: string) => {
		addExercise({
			workoutId: trainingId as Id<"workouts">,
			exerciseId: id as Id<"exercises">,
			order: exercises,
		});
		setSelectedId(undefined);
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.45, 0.7]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={selectedId === undefined}
					onPress={handleAddExercise}
					style={{
						backgroundColor: selectedId === undefined ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Ionicons color="white" name="add" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Přidat cvik</Text>
				</TouchableOpacity>
			}
			name={name}
			onDidDismiss={closeSheet}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
					<Ionicons color="white" name="add-outline" size={28} />
					<Text className="font-bold text-text text-xl">Přidat cvik</Text>
				</View>

				{sheetVisible && <ExercisePicker onSelect={handleExerciseSelect} selectedId={selectedId} />}
			</View>
		</TrueSheet>
	);
}
