import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditRoutineProps = {
	sheetName?: string;
	routineId: string;
	defaultName: string | undefined;
	defaultFilterId: string | undefined;
};

export default function EditRoutineModal({ sheetName, routineId, defaultName, defaultFilterId }: EditRoutineProps) {
	const sheetId = sheetName ?? NAMES.sheets.editRoutine;
	const [filterId, setFilterId] = useState<string | undefined>(defaultFilterId);
	const [name, setName] = useState(defaultName ?? "");
	const closeSheet = () => TrueSheet.dismiss(sheetId);

	useEffect(() => {
		setName(defaultName ?? "");
		setFilterId(defaultFilterId);
	}, [defaultFilterId, defaultName]);

	const editRoutine = useMutation(api.routines.editRoutine).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData && query.args.routineId === args.routineId) {
				const allFilters = localStore.getQuery(api.filters.getAllFilters, {});
				const filter = allFilters?.find((f: { _id: string }) => f._id === args.filterId);
				localStore.setQuery(api.routines.getRoutineById, query.args, {
					...currentData,
					name: args.name,
					filterId: args.filterId,
					filter: filter || null,
				});
			}
		}
	});

	const disabled = filterId === undefined || (name === defaultName && filterId === defaultFilterId);

	const handleEditRoutine = () => {
		editRoutine({
			routineId: routineId as Id<"routines">,
			name,
			filterId: filterId as Id<"filters">,
		});
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.7, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleEditRoutine}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Pencil color="white" size={20} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Upravit rutinu</Text>
				</TouchableOpacity>
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={22} />
						<Text className="font-bold text-text text-xl">Upravit rutinu</Text>
					</View>

					<View className="gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Název</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								maxLength={40}
								onChangeText={setName}
								onSubmitEditing={() => {
									if (!disabled) {
										handleEditRoutine();
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
