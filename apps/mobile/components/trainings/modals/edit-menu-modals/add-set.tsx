import { useMutation } from "convex/react";
import { Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
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
	const closeSheet = () => setVisible(false);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const addSet = useMutation(api.workoutExercises.addSet);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const inputRef = useRef<TextInput>(null);

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

	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [visible]);

	const disabled = weight === "" || reps === "";

	const handleAddSet = () => {
		if (weight !== "" && reps !== "") {
			addSet({
				workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
				weight: Number(weight),
				reps: Number(reps),
				order: setsLength ? setsLength : 0,
			});
			setWeight("");
			setReps("");
		}
		closeSheet();
		closeParent();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0, marginBottom: keyboardHeight }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[45%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Plus color="white" size={24} />
						<Text className="font-semibold text-text text-xl">Přidat sérii</Text>
					</View>

					<View className="mt-2 flex-row gap-4">
						<View className="flex-1">
							<Text className="mb-2 font-semibold text-lg text-text">Váha</Text>
							<TextInput
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
								ref={inputRef}
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
							onPress={() => {
								Keyboard.dismiss();
								handleAddSet();
							}}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Plus color="white" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Přidat sérii</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
