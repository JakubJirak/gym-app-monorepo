import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import DatePicker from "../forms/date-picker";
import FilterDropdown from "../forms/filters-dropdown";

type CreateTrainingModalProps = {
	createModalVisible: boolean;
	setCreateModalVisible: (visible: boolean) => void;
};

export default function CreateTrainingModal({ createModalVisible, setCreateModalVisible }: CreateTrainingModalProps) {
	const closeSheet = () => setCreateModalVisible(false);
	const [filterId, setFilterId] = useState<string | undefined>(undefined);
	const [date, setDate] = useState(new Date());

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={createModalVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[75%] rounded-t-lg bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<Text className="mb-6 text-center font-bold text-white text-xl">Vytvořit nový trénink</Text>
				<View className="gap-4">
					<View>
						<Text className="mb-2 font-semibold text-lg text-white">Nazev treninku</Text>
						<TextInput className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-white" />
					</View>
					<View>
						<Text className="mb-2 font-semibold text-lg text-white">Datum</Text>
						<DatePicker date={date} setDate={setDate} />
					</View>
					<View>
						<Text className="mb-2 font-semibold text-lg text-white">Filtr</Text>
						<FilterDropdown onChange={setFilterId} value={filterId} variant="modal" />
					</View>
				</View>

				<Pressable className="mt-auto mb-8 rounded-2xl bg-accent py-3">
					<Text className="text-center font-bold text-white text-xl">Vytvorit trenink</Text>
				</Pressable>
			</View>
		</Modal>
	);
}
