import Ionicons from "@expo/vector-icons/build/Ionicons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorSquarePicker from "@/components/forms/color-picker";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditFilterProps = {
	defaultColor: string;
	defaultName: string;
	filterId: string;
	usageCount: number;
	sheetName?: string;
};

export default function EditFilterModal({
	defaultColor,
	defaultName,
	filterId,
	usageCount,
	sheetName,
}: EditFilterProps) {
	const sheetId = sheetName ?? NAMES.sheets.editFilter;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
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
	useEffect(() => {
		setName(defaultName);
		setColor(defaultColor);
	}, [defaultName, defaultColor]);

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
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.55, 0.8]}
			dimmedDetentIndex={0.1}
			footer={
				usageCount === 0 ? (
					<View className="mb-6 flex-row gap-3 px-4">
						<TouchableOpacity
							className="flex w-16 items-center justify-center rounded-xl bg-destructive"
							onPress={handleDeleteFilter}
						>
							<Ionicons color="white" name="trash-outline" size={24} />
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center rounded-2xl px-4 py-3"
							disabled={disabled}
							onPress={handleEditFilter}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={20} />
							<Text className="px-3 py-1 text-center font-bold text-lg text-text">
								Upravit kategorii
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<TouchableOpacity
						className="mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
						disabled={disabled}
						onPress={handleEditFilter}
						style={{
							backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
						}}
					>
						<Pencil color="white" size={20} />
						<Text className="px-3 py-1 text-center font-bold text-lg text-text">
							Upravit kategorii
						</Text>
					</TouchableOpacity>
				)
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="justify-between">
					<View className="mt-2 flex-row items-center gap-2 self-center">
						<Pencil color="white" size={20} />
						<Text className="font-bold text-text text-xl">Upravit kategorii</Text>
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
		</TrueSheet>
	);
}
