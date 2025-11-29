import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	exerciseId: string;
	exerciseName: string;
};

export default function EditExerciseModal({
	sheetVisible,
	setSheetVisible,
	exerciseId,
	exerciseName,
}: EditExerciseProps) {
	const closeSheet = () => setSheetVisible(false);
	const [name, setName] = useState(exerciseName || "");
	const editExercise = useMutation(api.exercises.editExercise);

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
							<Text className="p-2 font-semibold text-lg text-text">Upravit cvik</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
