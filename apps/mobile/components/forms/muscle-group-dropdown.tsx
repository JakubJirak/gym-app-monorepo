import { useQuery } from "convex/react";
import { Check, ChevronDown } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, type ListRenderItem, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";

export type Option = {
	_id: string;
	name: string;
};

type Props = {
	value?: string;
	onChange: (value: string) => void;
};

export default function MuscleGroupDropdown({ value, onChange }: Props) {
	const [modalVisible, setModalVisible] = useState(false);

	const options = useQuery(api.muscleGroups.getAllMuscleGroups) || [];

	const selected = useMemo(() => options.find((o: Option) => o._id === value), [options, value]);

	function handleSelect(opt: Option) {
		onChange(opt._id);
		setModalVisible(false);
	}

	const renderItem: ListRenderItem<Option> = ({ item }) => {
		const isSelected = value === item._id;
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				className={`flex-row items-center justify-between rounded-md px-2 py-3 ${isSelected && "bg-secondary"}`}
				onPress={() => handleSelect(item)}
			>
				<Text className={`text-base text-white ${isSelected && "font-bold"}`}>{item.name}</Text>
				{isSelected ? <Check color={COLORS.muted} size={20} /> : null}
			</TouchableOpacity>
		);
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={0.85}
				className="flex-row items-center justify-between rounded-xl bg-secondary px-3 py-3.5"
				onPress={() => setModalVisible(true)}
			>
				<Text className={`${selected ? "text-text" : "text-muted"} text-base`}>
					{selected ? selected.name : "Vyberte svalovou partii..."}
				</Text>
				<ChevronDown color={COLORS.muted} size={20} />
			</TouchableOpacity>

			<Modal
				animationIn="slideInUp"
				animationOut="slideOutDown"
				backdropOpacity={0.5}
				backdropTransitionOutTiming={0}
				hideModalContentWhileAnimating={true}
				isVisible={modalVisible}
				onBackButtonPress={() => setModalVisible(false)}
				onBackdropPress={() => setModalVisible(false)}
				onSwipeComplete={() => setModalVisible(false)}
				propagateSwipe
				style={{ justifyContent: "flex-end", margin: 0 }}
				swipeDirection={["down"]}
				useNativeDriver
				useNativeDriverForBackdrop
			>
				<View className="h-[60%] rounded-t-xl bg-darker p-4">
					<View className="mb-4 h-1 w-10 self-center rounded-full bg-modalPicker" />

					<FlatList
						data={options}
						keyExtractor={(item) => item._id}
						ListEmptyComponent={() => (
							<View className="items-center py-8">
								<Text className="text-center text-muted">
									Nemáte žádné svalové partie
								</Text>
							</View>
						)}
						renderItem={renderItem}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</Modal>
		</>
	);
}
