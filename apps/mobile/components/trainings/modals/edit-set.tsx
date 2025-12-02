import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
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
	const closeSheet = () => setVisible(false);
	const [weight, setWeight] = useState(String(defaultWeight));
	const [reps, setReps] = useState(String(defaultReps));
	const editSet = useMutation(api.workoutExercises.editSet);
	const deleteSet = useMutation(api.workoutExercises.deleteSet);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [isClosing, setIsClosing] = useState(false);
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		const showListeners = [
			Keyboard.addListener("keyboardWillShow", (e) => {
				if (!isClosing) {
					setKeyboardHeight(e.endCoordinates.height);
				}
			}),
			Keyboard.addListener("keyboardDidShow", (e) => {
				if (!isClosing) {
					setKeyboardHeight(e.endCoordinates.height);
				}
			}),
		];
		const hideListeners = [
			Keyboard.addListener("keyboardWillHide", () => {
				if (!isClosing) {
					setKeyboardHeight(0);
				}
			}),
			Keyboard.addListener("keyboardDidHide", () => {
				if (!isClosing) {
					setKeyboardHeight(0);
				}
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
	}, [isClosing]);

	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [visible]);

	const disabled =
		weight === "" || reps === "" || (Number(weight) === defaultWeight && Number(reps) === defaultReps);

	const handleAddSet = () => {
		setIsClosing(true);
		editSet({
			setId: setId as Id<"sets">,
			weight: Number(weight),
			reps: Number(reps),
		});
		closeSheet();
	};

	const handleDeleteSet = () => {
		setIsClosing(true);
		deleteSet({
			setId: setId as Id<"sets">,
		});
		closeSheet();
	};

	const handleModalHide = () => {
		Keyboard.dismiss();
		setKeyboardHeight(0);
		setIsClosing(false);
		setWeight(String(defaultWeight));
		setReps(String(defaultReps));
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onModalHide={handleModalHide}
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
						<Pencil color="white" size={20} />
						<Text className="font-semibold text-text text-xl">Upravit sérii</Text>
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
							className="mr-3 flex w-[15%] items-center justify-center rounded-xl bg-destructive"
							onPress={handleDeleteSet}
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
							onPress={handleAddSet}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={18} />
							<Text className="p-2 font-semibold text-lg text-text">Upravit sérii</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
