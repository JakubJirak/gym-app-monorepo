import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditGoalsProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	squatDef: string;
	benchDef: string;
	deadliftDef: string;
	goalId: string;
};

export default function EditGoals({ visible, setVisible, squatDef, benchDef, deadliftDef, goalId }: EditGoalsProps) {
	const closeSheet = () => setVisible(false);
	const [squat, setSquat] = useState(squatDef);
	const [bench, setBench] = useState(benchDef);
	const [deadlift, setDeadlift] = useState(deadliftDef);

	const squatNum = Number.parseFloat(squat.replace(",", "."));
	const benchNum = Number.parseFloat(bench.replace(",", "."));
	const deadliftNum = Number.parseFloat(deadlift.replace(",", "."));

	const isValidNumber = (num: number) => !Number.isNaN(num) && num > 0 && num <= 1000;

	const disabled =
		!(isValidNumber(squatNum) && isValidNumber(benchNum) && isValidNumber(deadliftNum)) ||
		(squat === squatDef && bench === benchDef && deadlift === deadliftDef);

	const [keyboardHeight, setKeyboardHeight] = useState(0);

	const updateUserGoals = useMutation(api.userGoals.updateUserGoals);

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

	const handleSave = () => {
		if (squatDef || benchDef || deadliftDef) {
			updateUserGoals({
				goalId: goalId as Id<"userGoals">,
				squat,
				bench,
				deadlift,
			});
			closeSheet();
		}
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{
				justifyContent: "flex-end",
				margin: 0,
				marginBottom: keyboardHeight,
			}}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[90%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={20} />
						<Text className="font-semibold text-text text-xl">Upravit cíle</Text>
					</View>

					<View className="mt-2 gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Squat (kg)</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setSquat}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								value={squat}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Bench (kg)</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setBench}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								value={bench}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Deadlift (kg)</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setDeadlift}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								value={deadlift}
							/>
						</View>
					</View>

					<View className="mt-8 mb-6 flex-row justify-between">
						<TouchableOpacity
							className="flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl"
							disabled={disabled}
							onPress={handleSave}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={18} />
							<Text className="ml-2 p-2 font-semibold text-lg text-text">Upravit cíle</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
