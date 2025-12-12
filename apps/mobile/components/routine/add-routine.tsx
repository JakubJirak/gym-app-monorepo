import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditTrainingProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
};

export default function AddRoutine({ sheetVisible, setSheetVisible }: EditTrainingProps) {
	const [filterId, setFilterId] = useState<string | undefined>(undefined);
	const [name, setName] = useState("");
	const nameInputRef = useRef<TextInput>(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [isClosing, setIsClosing] = useState(false);

	const closeSheet = () => {
		setIsClosing(true);
		setSheetVisible(false);
	};
	const addRutina = useMutation(api.routines.addRoutine);
	const router = useRouter();

	const disabled = filterId === undefined || name.trim() === "";

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
				nameInputRef.current?.focus();
			}, 100);
		}
	}, [sheetVisible]);

	const handleAddRoutine = async () => {
		if (disabled) {
			return;
		}
		setIsClosing(true);
		if (filterId !== undefined) {
			const routineId = await addRutina({ name: name.trim(), filterId: filterId as Id<"filters"> });
			if (routineId) {
				router.navigate({ pathname: "/rutiny/[id]", params: { id: routineId.id } });
			}
		}
		closeSheet();
	};

	const handleModalHide = () => {
		Keyboard.dismiss();
		setKeyboardHeight(0);
		setIsClosing(false);
		setName("");
		setFilterId(undefined);
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
			<View className="h-[60%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Plus color="white" size={32} />
						<Text className="font-bold text-2xl text-text">Přidat rutinu</Text>
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
										handleAddRoutine();
									}
								}}
								ref={nameInputRef}
								returnKeyType="done"
								value={name}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Kategorie</Text>
							<FilterDropdown onChange={setFilterId} value={filterId} />
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
							onPress={handleAddRoutine}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Plus color="white" size={22} />
							<Text className="p-2 font-semibold text-lg text-text">Přidat rutinu</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
