import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DatePicker from "@/components/forms/date-picker";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditTrainingProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	trainingId: string;
	defaultName: string | undefined;
	defaultDate: string | undefined;
	defaultFilterId: string | undefined;
};

export default function EditTrainingModal({
	sheetVisible,
	setSheetVisible,
	trainingId,
	defaultName,
	defaultDate,
	defaultFilterId,
}: EditTrainingProps) {
	const [filterId, setFilterId] = useState<string | undefined>(defaultFilterId);
	const [date, setDate] = useState(new Date(defaultDate ?? ""));
	const [name, setName] = useState(defaultName ?? "");
	const closeSheet = () => setSheetVisible(false);
	const editWorkout = useMutation(api.workouts.editWorkout).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData && query.args.workoutId === args.workoutId) {
				localStore.setQuery(api.workouts.getWorkoutById, query.args, {
					...currentData,
					name: args.name,
					workoutDate: args.workoutDate,
				});
			}
		}
	});

	const disabled =
		filterId === undefined ||
		(name === defaultName && filterId === defaultFilterId && toLocalISODateString(date) === defaultDate);

	const handleEditTraining = async () => {
		await editWorkout({
			workoutId: trainingId as Id<"workouts">,
			name,
			workoutDate: toLocalISODateString(date),
			filterId: filterId as Id<"filters">,
		});
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
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
			<View className="h-[75%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={22} />
						<Text className="font-bold text-2xl text-text">Upravit trénink</Text>
					</View>

					<View className="gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Poznámka</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								maxLength={40}
								onChangeText={setName}
								onSubmitEditing={() => {
									if (!disabled) {
										handleEditTraining();
									}
								}}
								returnKeyType="done"
								value={name}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Datum</Text>
							<DatePicker date={date} setDate={setDate} />
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
							onPress={handleEditTraining}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Pencil color="white" size={16} />
							<Text className="p-2 font-semibold text-lg text-text">Upravit trénink</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
