import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import MuscleGroupDropdown from "../forms/muscle-group-dropdown";

type AddNewExerciseProps = {
	defaultName?: string;
	onExerciseCreated?: (exerciseId: string) => void;
	sheetName?: string;
};

export default function AddNewExerciseModal({ defaultName, onExerciseCreated, sheetName }: AddNewExerciseProps) {
	const sheetId = sheetName ?? NAMES.sheets.addNewExercise;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
	const [name, setName] = useState(defaultName ?? "");
	const [muscleGroupId, setMuscleGroupId] = useState<string | undefined>(undefined);
	const addExercise = useMutation(api.exercises.addExercise).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.exercises.getAllExercises, {});
		if (current) {
			const muscleGroups = localStore.getQuery(api.muscleGroups.getAllMuscleGroups, {});
			const muscleGroup = muscleGroups?.find((mg) => mg._id === args.muscleGroupId);
			const optimisticExercise = {
				_id: `temp-${Date.now()}` as Id<"exercises">,
				_creationTime: Date.now(),
				userId: "optimistic",
				name: args.name,
				muscleGroup: muscleGroup?.name || null,
				muscleGroupId: args.muscleGroupId,
			};
			localStore.setQuery(api.exercises.getAllExercises, {}, [...current, optimisticExercise]);
		}
	});

	const disabled = name === "" || muscleGroupId === undefined;

	const handleAddExercise = async () => {
		closeSheet();
		await addExercise({
			name,
			muscleGroupId: muscleGroupId as Id<"muscleGroups">,
		}).then((exerciseId) => {
			if (exerciseId && onExerciseCreated && !exerciseId.startsWith("temp-")) {
				onExerciseCreated(exerciseId);
			}
		});
		setName("");
		setMuscleGroupId(undefined);
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.7, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleAddExercise}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Ionicons color="white" name="add" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Přidat cvik</Text>
				</TouchableOpacity>
			}
			footerStyle={{ paddingHorizontal: 16 }}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
						<Ionicons color="white" name="add-outline" size={32} />
						<Text className="font-bold text-text text-xl">Přidat cvik</Text>
					</View>

					<View className="gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Název</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								maxLength={20}
								onChangeText={setName}
								onSubmitEditing={() => {
									if (!disabled) {
										handleAddExercise();
									}
								}}
								returnKeyType="done"
								value={name}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Svalová partie</Text>
							<MuscleGroupDropdown onChange={setMuscleGroupId} value={muscleGroupId} />
						</View>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
