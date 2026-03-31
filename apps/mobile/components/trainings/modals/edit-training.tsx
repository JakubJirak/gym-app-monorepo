import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "@/components/forms/date-picker";
import FilterDropdown from "@/components/forms/filters-dropdown";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditTrainingProps = {
	trainingId: string;
	defaultName: string | undefined;
	defaultDate: string | undefined;
	defaultFilterId: string | undefined;
	sheetName?: string;
};

const getSafeDate = (value: string | undefined) => {
	if (value === undefined || value === "") {
		return new Date();
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return new Date();
	}

	return parsed;
};

export default function EditTrainingModal({
	trainingId,
	defaultName,
	defaultDate,
	defaultFilterId,
	sheetName,
}: EditTrainingProps) {
	const sheetId = sheetName ?? NAMES.sheets.editTraining;
	const [filterId, setFilterId] = useState<string | undefined>(defaultFilterId);
	const [date, setDate] = useState(getSafeDate(defaultDate));
	const [name, setName] = useState(defaultName ?? "");
	const closeSheet = () => TrueSheet.dismiss(sheetId);

	useEffect(() => {
		setFilterId(defaultFilterId);
		setDate(getSafeDate(defaultDate));
		setName(defaultName ?? "");
	}, [defaultDate, defaultFilterId, defaultName]);

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

	const handleEditTraining = () => {
		editWorkout({
			workoutId: trainingId as Id<"workouts">,
			name,
			workoutDate: toLocalISODateString(date),
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
					className="mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleEditTraining}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Pencil color="white" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Upravit trénink</Text>
				</TouchableOpacity>
			}
			footerStyle={{ paddingHorizontal: 16 }}
			name={sheetId}
			scrollable
		>
			<View className="px-4 pt-8 pb-2">
				<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
					<Pencil color="white" size={18} />
					<Text className="font-bold text-text text-xl">Upravit trénink</Text>
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
			</View>
		</TrueSheet>
	);
}
