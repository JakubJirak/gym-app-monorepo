import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditTrainingProps = {
	sheetName?: string;
};

export default function AddRoutine({ sheetName }: EditTrainingProps) {
	const sheetId = sheetName ?? NAMES.sheets.addRoutine;
	const [filterId, setFilterId] = useState<string | undefined>(undefined);
	const [name, setName] = useState("");

	const closeSheet = () => {
		TrueSheet.dismiss(sheetId);
		setName("");
		setFilterId(undefined);
	};
	const addRutina = useMutation(api.routines.addRoutine);
	const router = useRouter();

	const disabled = filterId === undefined || name.trim() === "";

	const handleAddRoutine = async () => {
		if (disabled) {
			return;
		}
		if (filterId !== undefined) {
			const routineId = await addRutina({ name: name.trim(), filterId: filterId as Id<"filters"> });
			if (routineId) {
				router.navigate({ pathname: "/rutiny/[id]", params: { id: routineId.id } });
			}
		}
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.65, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleAddRoutine}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Plus color="white" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Přidat rutinu</Text>
				</TouchableOpacity>
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Plus color="white" size={32} />
						<Text className="font-bold text-text text-xl">Přidat rutinu</Text>
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
								returnKeyType="done"
								value={name}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Kategorie</Text>
							<FilterDropdown onChange={setFilterId} value={filterId} />
						</View>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
