import { useMutation, useQuery } from "convex/react";
import { NotebookPen } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type EditNoteProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	workoutExerciseId: string;
	closeParent: () => void;
};

export default function EditNoteModal({ visible, setVisible, workoutExerciseId, closeParent }: EditNoteProps) {
	const closeSheet = () => setVisible(false);
	const workoutExercise = useQuery(api.workoutExercises.getWorkoutExerciseById, {
		workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
	});
	const [note, setNote] = useState<string | undefined>(workoutExercise?.note);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const inputRef = useRef<TextInput>(null);
	const editNote = useMutation(api.workoutExercises.editNote);

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

	const handleEditNote = () => {
		editNote({
			workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
			note,
		});
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
			<View className="h-[63%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
						<NotebookPen color={COLORS.accent} size={20} />
						<Text className="font-semibold text-text text-xl">Upravit poznámku</Text>
					</View>

					<View className="mt-2 gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Poznámka</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								defaultValue={workoutExercise?.note || ""}
								maxLength={50}
								onChangeText={setNote}
								onSubmitEditing={handleEditNote}
								ref={inputRef}
								returnKeyType="done"
								value={note}
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
							className="flex w-[60%] flex-row items-center justify-center rounded-xl bg-accent"
							onPress={handleEditNote}
						>
							<NotebookPen color="white" size={20} />
							<Text className="p-1 font-semibold text-lg text-text">Upravit poznámku</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
