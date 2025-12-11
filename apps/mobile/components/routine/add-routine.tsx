import { useMutation } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
	const closeSheet = () => setSheetVisible(false);
	const addRutina = useMutation(api.routines.addRoutine);

	const disabled = filterId === undefined || name.trim() === "";

	const handleAddRoutine = async () => {
		if (disabled) {
			return;
		}
		if (filterId !== undefined) {
			await addRutina({ name: name.trim(), filterId: filterId as Id<"filters"> });
		}
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[70%] rounded-t-xl bg-darker p-4">
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
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								maxLength={20}
								onChangeText={setName}
								onSubmitEditing={() => {
									if (!disabled) {
										handleAddRoutine();
									}
								}}
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
