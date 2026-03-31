import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditSetProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	setId: string;
	defaultWeight: number;
	defaultReps: number;
};

export default function EditSetModal({ visible, setVisible, setId, defaultReps, defaultWeight }: EditSetProps) {
	const name = `${NAMES.sheets.trainingEditSet}-${setId}`;
	const closeSheet = () => setVisible(false);
	const [weight, setWeight] = useState(String(defaultWeight));
	const [reps, setReps] = useState(String(defaultReps));
	const editSet = useMutation(api.workoutExercises.editSet).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises) {
				const updatedExercises = currentData.exercises.map((exercise) => ({
					...exercise,
					sets:
						exercise.sets?.map((set) =>
							set._id === args.setId
								? { ...set, reps: args.reps, weight: args.weight }
								: set
						) || null,
				}));
				localStore.setQuery(api.workouts.getWorkoutById, query.args, {
					...currentData,
					exercises: updatedExercises,
				});
			}
		}
	});
	const deleteSet = useMutation(api.workoutExercises.deleteSet).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises) {
				const updatedExercises = currentData.exercises.map((exercise) => ({
					...exercise,
					sets: exercise.sets?.filter((set) => set._id !== args.setId) || null,
				}));
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

	const disabled =
		weight === "" || reps === "" || (Number(weight) === defaultWeight && Number(reps) === defaultReps);

	const handleAddSet = () => {
		editSet({
			setId: setId as Id<"sets">,
			weight: Number(weight),
			reps: Number(reps),
		});
		closeSheet();
	};

	const handleDeleteSet = () => {
		deleteSet({
			setId: setId as Id<"sets">,
		});
		closeSheet();
	};

	const handleDidDismiss = () => {
		setWeight(String(defaultWeight));
		setReps(String(defaultReps));
		setVisible(false);
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.5, 0.7]}
			dimmedDetentIndex={0.1}
			footer={
				<View className="mx-4 mb-6 flex-row items-center gap-3">
					<TouchableOpacity
						className="h-full w-14 flex-row items-center justify-center rounded-2xl bg-destructive"
						onPress={handleDeleteSet}
					>
						<Ionicons color="white" name="trash-outline" size={18} />
					</TouchableOpacity>
					<TouchableOpacity
						className="flex-1 flex-row items-center justify-center rounded-2xl px-4 py-2"
						disabled={disabled}
						onPress={handleAddSet}
						style={{
							backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
						}}
					>
						<Pencil color="white" size={18} />
						<Text className="px-2 py-1 font-bold text-lg text-text">Upravit sérii</Text>
					</TouchableOpacity>
				</View>
			}
			name={name}
			onDidDismiss={handleDidDismiss}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
					<Pencil color="white" size={20} />
					<Text className="font-bold text-text text-xl">Upravit sérii</Text>
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
