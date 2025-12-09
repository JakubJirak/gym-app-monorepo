import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	exerciseId: string;
	exerciseName: string;
	usageCount: number;
};

export default function EditExerciseModal({
	sheetVisible,
	setSheetVisible,
	exerciseId,
	exerciseName,
	usageCount,
}: EditExerciseProps) {
	const closeSheet = () => setSheetVisible(false);
	const [name, setName] = useState(exerciseName || "");
	const editExercise = useMutation(api.exercises.editExercise);
	const deleteExercise = useMutation(api.exercises.deleteExercise);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const showListeners = [
			Keyboard.addListener("keyboardWillShow", (e) => {
				setKeyboardHeight(e.endCoordinates.height);
			}),
			Keyboard.addListener("keyboardDidShow", (e) => {
				setKeyboardHeight(e.endCoordinates.height);
			}),
		];
		const hideListeners = [
			Keyboard.addListener("keyboardWillHide", () => {
				setKeyboardHeight(0);
			}),
			Keyboard.addListener("keyboardDidHide", () => {
				setKeyboardHeight(0);
			}),
		];

		return () => {
			for (const listener of showListeners) {
				listener.remove();
			}
			for (const listener of hideListeners) {
				listener.remove();
			}
		};
	}, []);

	const disabled = name === "";

	const handleEditExercise = () => {
		if (name !== "") {
			editExercise({
				exerciseId: exerciseId as Id<"exercises">,
				name,
			});
			setName("");
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
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0, marginBottom: keyboardHeight }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[40%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-between">
					<View className="mt-2 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={22} />
						<Text className="font-bold text-2xl text-text">Upravit cvik</Text>
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

					<View className="mt-4 mb-6 flex-row">
						{usageCount === 0 ? (
							<View className="mt-8 mb-6 flex-row">
								<TouchableOpacity
									className="mr-3 flex w-[15%] items-center justify-center rounded-xl bg-destructive"
									onPress={handleDeleteExercise}
								>
									<Ionicons color="white" name="trash-outline" size={24} />
								</TouchableOpacity>
								<TouchableOpacity
									className="mr-3 flex w-[25%] items-center justify-center rounded-xl border border-border"
									onPress={closeSheet}
								>
									<Text className="p-2 text-lg text-text">Zrušit</Text>
								</TouchableOpacity>

								<TouchableOpacity
									className="flex w-[52%] flex-row items-center justify-center rounded-xl"
									disabled={disabled}
									onPress={handleEditExercise}
									style={{
										backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
									}}
								>
									<Pencil color="white" size={18} />
									<Text className="p-2 font-semibold text-lg text-text">
										Upravit cvik
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<>
								<TouchableOpacity
									className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
									onPress={closeSheet}
								>
									<Text className="p-2 text-lg text-text">Zrušit</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="flex w-[60%] flex-row items-center justify-center rounded-xl"
									disabled={disabled}
									onPress={handleEditExercise}
									style={{
										backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
									}}
								>
									<Pencil color="white" size={16} />
									<Text className="p-2 font-semibold text-lg text-text">
										Upravit cvik
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
}
