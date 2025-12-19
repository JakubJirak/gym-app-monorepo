import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditRoutineProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	routineId: string;
	defaultName: string | undefined;
	defaultFilterId: string | undefined;
};

export default function EditRoutineModal({
	sheetVisible,
	setSheetVisible,
	routineId,
	defaultName,
	defaultFilterId,
}: EditRoutineProps) {
	const [filterId, setFilterId] = useState<string | undefined>(defaultFilterId);
	const [name, setName] = useState(defaultName ?? "");
	const closeSheet = () => setSheetVisible(false);
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
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[65%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={22} />
						<Text className="font-bold text-2xl text-text">Upravit rutinu</Text>
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

					<View className="mt-8 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl"
							disabled={disabled}
							onPress={handleEditRoutine}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={16} />
							<Text className="p-2 font-semibold text-lg text-text">Upravit rutinu</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
