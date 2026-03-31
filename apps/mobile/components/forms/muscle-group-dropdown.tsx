import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Check, ChevronDown } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, type ListRenderItem, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";

export type Option = {
	_id: string;
	name: string;
};

type Props = {
	value?: string;
	onChange: (value: string) => void;
	sheetName?: string;
};

export default function MuscleGroupDropdown({ value, onChange, sheetName }: Props) {
	const sheetId = sheetName ?? NAMES.sheets.muscleGroupDropdown;

	const options = useQuery(api.muscleGroups.getAllMuscleGroups) || [];

	const selected = useMemo(() => options.find((o: Option) => o._id === value), [options, value]);

	function handleSelect(opt: Option) {
		onChange(opt._id);
		TrueSheet.dismiss(sheetId);
	}

	const renderItem: ListRenderItem<Option> = ({ item }) => {
		const isSelected = value === item._id;
		return (
			<TouchableOpacity
				activeOpacity={0.7}
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
				activeOpacity={0.7}
				className="flex-row items-center justify-between rounded-xl bg-secondary px-3 py-3.5"
				onPress={() => TrueSheet.present(sheetId)}
			>
				<Text className={`${selected ? "text-text" : "text-muted"} text-base`}>
					{selected ? selected.name : "Vyberte svalovou partii..."}
				</Text>
				<ChevronDown color={COLORS.muted} size={20} />
			</TouchableOpacity>

			<TrueSheet
				backgroundColor={COLORS.darker}
				cornerRadius={24}
				detents={[0.7, 1]}
				dimmedDetentIndex={0.1}
				name={sheetId}
				scrollable
			>
				<View className="px-4 pt-8 pb-4">
					<View className="mb-3 flex-row items-center justify-center gap-2">
						<Text className="font-bold text-text text-xl">Svalová partie</Text>
					</View>

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
						nestedScrollEnabled
						renderItem={renderItem}
						scrollEnabled
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</TrueSheet>
		</>
	);
}
