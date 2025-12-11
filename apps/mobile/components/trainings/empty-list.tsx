import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import CreateTrainingModal from "../create/create-training-modal";

export default function EmptyList() {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(true)}>
			<View className="w-full items-center justify-center py-8">
				<Text className="text-base text-muted">Žádné tréninky</Text>
				<View className="mt-6 w-full flex-row items-center justify-center gap-2">
					<Text className="text-base text-muted">Přidejte trénink pomocí tlačítka</Text>
					<Ionicons color={COLORS.muted} name="add-circle-outline" size={24} />
				</View>
			</View>
			<CreateTrainingModal createModalVisible={modalVisible} setCreateModalVisible={setModalVisible} />
		</TouchableOpacity>
	);
}
