import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, type ListRenderItem, Text, TouchableOpacity, View } from "react-native";
import AddFilterModal from "@/components/filters/add-filter";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";

export type Option = {
	_id: string;
	name: string;
	color: string;
};

type Props = {
	value?: string;
	onChange: (value: string) => void;
};

export default function FilterDropdown({ value, onChange }: Props) {
	const options = useQuery(api.filters.getAllFilters) || [];

	const selected = useMemo(() => options.find((o: Option) => o._id === value), [options, value]);

	function handleSelect(opt: Option) {
		onChange(opt._id);
		TrueSheet.dismiss(NAMES.sheets.filterDropdown);
	}

	const renderItem: ListRenderItem<Option> = ({ item }) => {
		const isSelected = value === item._id;
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				className={`flex-row items-center justify-between rounded-md px-2 py-3 ${isSelected && "bg-secondary"}`}
				onPress={() => handleSelect(item)}
			>
				<View className="flex-row items-center">
					<View
						style={{
							width: 16,
							height: 16,
							borderRadius: 10,
							backgroundColor: item.color,
							marginRight: 12,
						}}
					/>
					<Text className={`text-base text-white ${isSelected && "font-bold"}`}>{item.name}</Text>
				</View>

				{isSelected ? <Check color={COLORS.muted} size={20} /> : null}
			</TouchableOpacity>
		);
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={0.85}
				className="flex-row items-center justify-between rounded-xl bg-secondary px-3 py-3.5"
				onPress={() => TrueSheet.present(NAMES.sheets.filterDropdown)}
			>
				<View className="flex-row items-center">
					{selected ? (
						<View
							style={{
								width: 16,
								height: 16,
								borderRadius: 10,
								backgroundColor: selected.color,
								marginRight: 12,
							}}
						/>
					) : null}

					<Text className={`${selected ? "text-text" : "text-muted"} text-base`}>
						{selected ? selected.name : "Vyberte kategorii..."}
					</Text>
				</View>

				<ChevronDown color={COLORS.muted} size={20} />
			</TouchableOpacity>

			<TrueSheet
				backgroundColor={COLORS.darker}
				cornerRadius={24}
				detents={[0.6, 1]}
				dimmedDetentIndex={0.1}
				name={NAMES.sheets.filterDropdown}
				scrollable
			>
				<View className="px-4 pt-8 pb-4">
					<FlatList
						data={options}
						keyExtractor={(item) => item._id}
						ListEmptyComponent={() => (
							<View className="items-center py-8">
								<Text className="mb-4 text-center text-muted">
									Nemáte žádné kategorie
								</Text>
							</View>
						)}
						ListFooterComponent={() => (
							<View className="mt-4 items-center">
								<TouchableOpacity
									activeOpacity={0.8}
									className="flex-row items-center gap-2 rounded-xl bg-secondary px-4 py-3"
									onPress={async () => {
										await TrueSheet.dismiss(NAMES.sheets.filterDropdown);
										await TrueSheet.present(NAMES.sheets.addFilter);
									}}
								>
									<Plus color="white" size={20} />
									<Text className="font-semibold text-text">
										Přidat novou kategorii
									</Text>
								</TouchableOpacity>
							</View>
						)}
						renderItem={renderItem}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</TrueSheet>

			<AddFilterModal />
		</>
	);
}
