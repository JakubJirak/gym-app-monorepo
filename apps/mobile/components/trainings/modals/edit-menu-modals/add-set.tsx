import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type AddSetProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	workoutExerciseId: string;
	closeParent: () => void;
	setsLength: number | undefined;
};

export default function AddSetModal({ visible, setVisible, workoutExerciseId, closeParent, setsLength }: AddSetProps) {
	const name = `${NAMES.sheets.trainingAddSet}-${workoutExerciseId}`;
	const closeSheet = () => setVisible(false);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const addSet = useMutation(api.workoutExercises.addSet).withOptimisticUpdate((localStore, args) => {
		// Get the current workout data from all possible queries
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);

		for (const query of queries) {
			const currentData = query.value;

			// biome-ignore lint/complexity/useOptionalChain: logic of the app
			if (currentData && currentData.exercises) {
				// Find the exercise that this set belongs to
				const updatedExercises = currentData.exercises.map((exercise) => {
					if (exercise._id === args.workoutExerciseId) {
						// Add optimistic set
						const optimisticSet = {
							_id: `temp-${Date.now()}` as Id<"sets">,
							reps: args.reps,
							weight: args.weight,
							order: args.order,
						};

						return {
							...exercise,
							sets: exercise.sets ? [...exercise.sets, optimisticSet] : [optimisticSet],
						};
					}
					return exercise;
				});

				// Update the query with optimistic data
				localStore.setQuery(api.workouts.getWorkoutById, query.args, {
					...currentData,
					exercises: updatedExercises,
				});
			}
		}
	});
	useEffect(() => {
		if (visible) {
			TrueSheet.present(name);
		} else {
			TrueSheet.dismiss(name);
		}
	}, [name, visible]);

	const disabled = weight === "" || reps === "";

	const handleAddSet = () => {
		if (weight !== "" && reps !== "") {
			addSet({
				workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
				weight: Number(weight),
				reps: Number(reps),
				order: setsLength ? setsLength : 0,
			});
		}
		closeSheet();
		closeParent();
	};

	const handleDidDismiss = () => {
		setWeight("");
		setReps("");
		setVisible(false);
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.5, 0.7]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleAddSet}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Plus color="white" size={20} />
					<Text className="px-2 py-1 font-bold text-lg text-text">Přidat sérii</Text>
				</TouchableOpacity>
			}
			name={name}
			onDidDismiss={handleDidDismiss}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
					<Plus color="white" size={24} />
					<Text className="font-bold text-text text-xl">Přidat sérii</Text>
				</View>

				<View className="mt-2 flex-row gap-4">
					<View className="flex-1">
						<Text className="mb-2 font-semibold text-lg text-text">Váha</Text>
						<TextInput
							autoFocus
							className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
							cursorColorClassName="accent-text"
							keyboardType="numeric"
							maxLength={5}
							onChangeText={setWeight}
							onSubmitEditing={() => {
								if (!disabled) {
									handleAddSet();
								}
							}}
							returnKeyType="done"
							value={weight}
						/>
					</View>
					<View className="flex-1">
						<Text className="mb-2 font-semibold text-lg text-text">Opakování</Text>
						<TextInput
							className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
							cursorColorClassName="accent-text"
							keyboardType="numeric"
							maxLength={5}
							onChangeText={setReps}
							onSubmitEditing={() => {
								if (!disabled) {
									handleAddSet();
								}
							}}
							returnKeyType="done"
							value={reps}
						/>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
