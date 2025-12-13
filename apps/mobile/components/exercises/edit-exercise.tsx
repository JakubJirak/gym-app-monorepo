import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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
	const closeSheet = () => {
		setIsClosing(true);
		setSheetVisible(false);
	};
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
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [isClosing, setIsClosing] = useState(false);
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (sheetVisible) {
			setName(exerciseName);
		}
	}, [sheetVisible, exerciseName]);

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
		if (sheetVisible) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [sheetVisible]);

	const disabled = name === "" || name === exerciseName;

	const handleEditExercise = () => {
		setIsClosing(true);
		if (name !== "") {
			editExercise({
				exerciseId: exerciseId as Id<"exercises">,
				name,
			});
			closeSheet();
		}
	};

	const handleDeleteExercise = () => {
		setIsClosing(true);
		deleteExercise({
			exerciseId: exerciseId as Id<"exercises">,
		});
		closeSheet();
	};

	const handleModalHide = () => {
		Keyboard.dismiss();
		setKeyboardHeight(0);
		setIsClosing(false);
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
			onModalHide={handleModalHide}
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
							className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
							cursorColorClassName="accent-text"
							maxLength={20}
							onChangeText={setName}
							onSubmitEditing={() => {
								if (!disabled) {
									handleEditExercise();
								}
							}}
							ref={inputRef}
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
