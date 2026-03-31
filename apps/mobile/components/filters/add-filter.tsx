import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorSquarePicker from "@/components/forms/color-picker";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type AddFilterProps = {
	sheetName?: string;
};

export default function AddFilterModal({ sheetName }: AddFilterProps) {
	const sheetId = sheetName ?? NAMES.sheets.addFilter;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
	const [name, setName] = useState("");
	const [visible, setVisible] = useState(false);
	const [color, setColor] = useState("#000000");
	const addFilter = useMutation(api.filters.addFilter).withOptimisticUpdate((localStore, args) => {
		const current = localStore.getQuery(api.filters.getAllFilters, {});
		if (current) {
			const optimisticFilter = {
				_id: `temp-${Date.now()}` as Id<"filters">,
				_creationTime: Date.now(),
				userId: "optimistic",
				name: args.name,
				color: args.color,
			};
			localStore.setQuery(api.filters.getAllFilters, {}, [...current, optimisticFilter]);
		}
	});

	const disabled = name === "";

	const handleAddExercise = () => {
		addFilter({
			name,
			color,
		});
		setName("");
		setColor("#000000");
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.55, 0.8]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleAddExercise}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Ionicons color="white" name="add" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">
						Přidat kategorii
					</Text>
				</TouchableOpacity>
			}
			footerStyle={{ paddingHorizontal: 16 }}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="justify-between">
					<View className="mt-2 flex-row items-center gap-2 self-center">
						<Ionicons color="white" name="add-outline" size={28} />
						<Text className="font-bold text-text text-xl">Přidat kategorii</Text>
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
										handleAddExercise();
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
				columns={36}
				initialHex="#000000"
				onColorChange={(hex) => setColor(hex)}
				rows={48}
				setVisible={setVisible}
				size={320}
				visible={visible}
			/>
		</TrueSheet>
	);
}
