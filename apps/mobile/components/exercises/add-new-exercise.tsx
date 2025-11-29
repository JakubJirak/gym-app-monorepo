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
};

export default function AddNewExerciseModal({ sheetVisible, setSheetVisible, defaultName }: AddNewExerciseProps) {
	const closeSheet = () => setSheetVisible(false);
	const [name, setName] = useState(defaultName ?? "");
	const [muscleGroupId, setMuscleGroupId] = useState<string | undefined>(undefined);
	const addExercise = useMutation(api.exercises.addExercise);

	const disabled = name === "" || muscleGroupId === undefined;

	const handleAddExercise = () => {
		addExercise({
			name,
			muscleGroupId: muscleGroupId as Id<"muscleGroups">,
		});
		setName("");
		setMuscleGroupId(undefined);
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[55%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-between">
					<View className="mt-2 flex-row items-center gap-2 self-center">
						<Ionicons color="white" name="add-outline" size={32} />
						<Text className="font-bold text-2xl text-text">Přidat cvik</Text>
					</View>

					<View className="gap-4">
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
										handleAddExercise();
									}
								}}
								returnKeyType="done"
								value={name}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Svalová partie</Text>
							<MuscleGroupDropdown
								onChange={setMuscleGroupId}
								value={muscleGroupId}
								variant="modal"
							/>
						</View>
					</View>

					<View className="mt-4 mb-6 flex-row">
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
