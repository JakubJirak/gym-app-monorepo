import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import ColorSquarePicker from "@/components/forms/color-picker";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditFilterProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	defaultColor: string;
	defaultName: string;
	filterId: string;
	usageCount: number;
};

export default function EditFilterModal({
	sheetVisible,
	setSheetVisible,
	defaultColor,
	defaultName,
	filterId,
	usageCount,
}: EditFilterProps) {
	const closeSheet = () => setSheetVisible(false);
	const [name, setName] = useState(defaultName);
	const [visible, setVisible] = useState(false);
	const [color, setColor] = useState(defaultColor);
	const editFilter = useMutation(api.filters.editFilter).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.filters.getAllFilters, {});
		if (current) {
			const updatedFilters = current.map((filter) =>
				filter._id === args.filterId ? { ...filter, name: args.name, color: args.color } : filter
			);
			localStore.setQuery(api.filters.getAllFilters, {}, updatedFilters);
		}
	});
	const deleteFilter = useMutation(api.filters.deleteFilter).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.filters.getAllFilters, {});
		if (current) {
			const filteredFilters = current.filter((filter) => filter._id !== args.filterId);
			localStore.setQuery(api.filters.getAllFilters, {}, filteredFilters);
		}
	});
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		if (sheetVisible) {
			setName(defaultName);
			setColor(defaultColor);
		}
	}, [sheetVisible, defaultName, defaultColor]);

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

	const disabled = name === defaultName && color === defaultColor;

	const handleEditFilter = () => {
		editFilter({
			filterId: filterId as Id<"filters">,
			name,
			color,
		});
		closeSheet();
	};

	const handleDeleteFilter = () => {
		deleteFilter({
			filterId: filterId as Id<"filters">,
		});
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
						<Pencil color="white" size={20} />
						<Text className="font-bold text-2xl text-text">Upravit kategorii</Text>
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
										handleEditFilter();
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
						{usageCount === 0 ? (
							<View className="mt-8 mb-6 flex-row">
								<TouchableOpacity
									className="mr-3 flex w-[15%] items-center justify-center rounded-xl bg-destructive"
									onPress={handleDeleteFilter}
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
									onPress={handleEditFilter}
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
									onPress={handleEditFilter}
									style={{
										backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
									}}
								>
									<Pencil color="white" size={16} />
									<Text className="p-2 font-semibold text-lg text-text">
										Upravit kategorii
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</View>
			<ColorSquarePicker
				columns={48}
				initialHex={defaultColor}
				onColorChange={(hex) => setColor(hex)}
				rows={48}
				setVisible={setVisible}
				size={320}
				visible={visible}
			/>
		</Modal>
	);
}
