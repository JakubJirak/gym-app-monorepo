import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import ColorSquarePicker from "@/components/forms/color-picker";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type AddFilterProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
};

export default function AddFilterModal({ sheetVisible, setSheetVisible }: AddFilterProps) {
	const closeSheet = () => setSheetVisible(false);
	const [name, setName] = useState("");
	const [visible, setVisible] = useState(false);
	const [color, setColor] = useState("#000000");
	const addFilter = useMutation(api.filters.addFilter).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.filters.getAllFilters, {});
		if (current) {
			const optimisticFilter = {
				_id: `temp-${Date.now()}` as Id<"filters">,
				_creationTime: Date.now(),
				userId: "optimistic",
				name: args.name,
				color: args.color,
			};
			localStore.setQuery(api.filters.getAllFilters, {}, [...current, optimisticFilter]);
		}
	});
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

	const handleAddExercise = () => {
		addFilter({
			name,
			color,
		});
		setName("");
		setColor("#000000");
		closeSheet();
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
			style={{ justifyContent: "flex-end", margin: 0, marginBottom: keyboardHeight }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[55%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 justify-between">
					<View className="mt-2 flex-row items-center gap-2 self-center">
						<Ionicons color="white" name="add-outline" size={32} />
						<Text className="font-bold text-2xl text-text">Přidat kategorii</Text>
					</View>

					<View className="gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Název</Text>
							<TextInput
								autoFocus
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								maxLength={15}
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
							<Text className="mb-2 font-semibold text-lg text-text">Barva</Text>
							<TouchableOpacity
								className="flex-row items-center gap-4 rounded-xl bg-secondary px-3 py-3"
								onPress={() => setVisible(true)}
							>
								<View
									className="size-7 rounded-full"
									style={{ backgroundColor: color }}
								/>
								<Text className="text-base text-muted">Vybrat jinou barvu</Text>
							</TouchableOpacity>
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
							<Text className="p-2 font-semibold text-lg text-text">Přidat kategorii</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<ColorSquarePicker
				columns={48}
				initialHex="#000000"
				onColorChange={(hex) => setColor(hex)}
				rows={48}
				setVisible={setVisible}
				size={320}
				visible={visible}
			/>
		</Modal>
	);
}
