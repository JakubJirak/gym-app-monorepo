import { Ionicons } from "@expo/vector-icons";
import { ChevronDown, ChevronUp, NotebookPen, Pencil, Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import AddSetModal from "./edit-menu-modals/add-set";

type EditMenuProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	exerciseId: string;
	setsLength: number | undefined;
};

export default function EditMenuModal({ sheetVisible, setSheetVisible, exerciseId, setsLength }: EditMenuProps) {
	const [set, setSet] = useState(false);
	const closeSheet = () => setSheetVisible(false);

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[63%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="mt-3 flex-1 gap-5">
					<TouchableOpacity
						className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]"
						onPress={() => setSet(true)}
					>
						<Plus color={COLORS.accent} size={24} />
						<Text className="text-lg text-white">Přidat sérii</Text>
					</TouchableOpacity>
					<TouchableOpacity className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]">
						<Pencil color={COLORS.accent} size={20} />
						<Text className="text-lg text-white">Změnit cvik</Text>
					</TouchableOpacity>
					<TouchableOpacity className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]">
						<NotebookPen color={COLORS.accent} size={20} />
						<Text className="text-lg text-white">Upravit poznámku</Text>
					</TouchableOpacity>
					<TouchableOpacity className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]">
						<ChevronUp color={COLORS.accent} size={28} />
						<Text className="text-lg text-white">Posunout nahoru</Text>
					</TouchableOpacity>
					<TouchableOpacity className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]">
						<ChevronDown color={COLORS.accent} size={28} />
						<Text className="text-lg text-white">Posunout dolů</Text>
					</TouchableOpacity>
					<TouchableOpacity className="w-full flex-row items-center gap-2 rounded-xl bg-destructive px-3 py-2.5 pl-[25%]">
						<Ionicons color="white" name="trash-outline" size={24} />
						<Text className="text-lg text-white">Odstranit cvik</Text>
					</TouchableOpacity>
				</View>
			</View>
			<AddSetModal
				closeParent={closeSheet}
				exerciseId={exerciseId}
				setsLength={setsLength}
				setVisible={setSet}
				visible={set}
			/>
		</Modal>
	);
}
