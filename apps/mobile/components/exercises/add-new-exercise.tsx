import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import MuscleGroupDropdown from "../forms/muscle-group-dropdown";

type AddNewExerciseProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	defaultName?: string;
	onExerciseCreated?: (exerciseId: string) => void;
};

export default function AddNewExerciseModal({
	sheetVisible,
	setSheetVisible,
	defaultName,
	onExerciseCreated,
}: AddNewExerciseProps) {
	const closeSheet = () => setSheetVisible(false);
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
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[80%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
						<Ionicons color="white" name="add-outline" size={32} />
						<Text className="font-bold text-2xl text-text">Přidat cvik</Text>
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

					<View className="mt-8 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl"
							disabled={disabled}
							onPress={handleAddExercise}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Ionicons color="white" name="add" size={28} />
							<Text className="p-2 font-semibold text-lg text-text">Přidat cvik</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
