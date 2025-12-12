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
	const closeSheet = () => {
		Keyboard.dismiss();
		setSheetVisible(false);
	};
	const addRutina = useMutation(api.routines.addRoutine);
	const router = useRouter();

	const disabled = filterId === undefined || name.trim() === "";

	useEffect(() => {
		if (sheetVisible) {
			// Small delay to ensure modal is fully visible
			setTimeout(() => {
				nameInputRef.current?.focus();
			}, 300);
		}
	}, [sheetVisible]);

	const handleAddRoutine = async () => {
		if (disabled) {
			return;
		}
		if (filterId !== undefined) {
			const routineId = await addRutina({ name: name.trim(), filterId: filterId as Id<"filters"> });
			if (routineId) {
				setFilterId(undefined);
				setName("");
				router.navigate({ pathname: "/rutiny/[id]", params: { id: routineId.id } });
			}
		}
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			avoidKeyboard
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onModalHide={() => {
				setName("");
				setFilterId(undefined);
			}}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[50%] rounded-t-xl bg-darker p-4">
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
