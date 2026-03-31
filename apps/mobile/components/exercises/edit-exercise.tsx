import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	exerciseId: string;
	exerciseName: string;
	usageCount: number;
	sheetName?: string;
};

export default function EditExerciseModal({ exerciseId, exerciseName, usageCount, sheetName }: EditExerciseProps) {
	const sheetId = sheetName ?? NAMES.sheets.editExercise;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
	const [name, setName] = useState(exerciseName || "");
	const editExercise = useMutation(api.exercises.editExercise).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.exercises.getAllExercises, {});
		if (current) {
			const updatedExercises = current.map((exercise) =>
				exercise._id === args.exerciseId ? { ...exercise, name: args.name } : exercise
			);
			localStore.setQuery(api.exercises.getAllExercises, {}, updatedExercises);
		}
	});
	const deleteExercise = useMutation(api.exercises.deleteExercise).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.exercises.getAllExercises, {});
		if (current) {
			const filteredExercises = current.filter((exercise) => exercise._id !== args.exerciseId);
			localStore.setQuery(api.exercises.getAllExercises, {}, filteredExercises);
		}
	});

	useEffect(() => {
		setName(exerciseName);
	}, [exerciseName]);

	const disabled = name === "" || name === exerciseName;

	const handleEditExercise = () => {
		if (name !== "") {
			editExercise({
				exerciseId: exerciseId as Id<"exercises">,
				name,
			});
			closeSheet();
		}
	};

	const handleDeleteExercise = () => {
		deleteExercise({
			exerciseId: exerciseId as Id<"exercises">,
		});
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.5, 1]}
			dimmedDetentIndex={0.1}
			footer={
				usageCount === 0 ? (
					<View className="mb-6 flex-row gap-3 px-4">
						<TouchableOpacity
							className="flex w-16 items-center justify-center rounded-xl bg-destructive"
							onPress={handleDeleteExercise}
						>
							<Ionicons color="white" name="trash-outline" size={24} />
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center rounded-2xl px-4 py-3"
							disabled={disabled}
							onPress={handleEditExercise}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={20} />
							<Text className="px-3 py-1 text-center font-bold text-lg text-text">
								Upravit cvik
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<TouchableOpacity
						className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl py-3"
						disabled={disabled}
						onPress={handleEditExercise}
						style={{
							backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
						}}
					>
						<Pencil color="white" size={20} />
						<Text className="px-3 py-1 text-center font-bold text-lg text-text">
							Upravit cvik
						</Text>
					</TouchableOpacity>
				)
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
						<Pencil color="white" size={20} />
						<Text className="font-bold text-text text-xl">Upravit cvik</Text>
					</View>

					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Název</Text>
						<TextInput
							autoFocus
							className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
							cursorColorClassName="accent-text"
							maxLength={20}
							onChangeText={setName}
							onSubmitEditing={() => {
								if (!disabled) {
									handleEditExercise();
								}
							}}
							returnKeyType="done"
							value={name}
						/>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
