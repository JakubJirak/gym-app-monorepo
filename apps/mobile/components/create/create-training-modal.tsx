import Ionicons from "@expo/vector-icons/build/Ionicons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import DatePicker from "../forms/date-picker";
import FilterDropdown from "../forms/filters-dropdown";

export default function CreateTrainingModal() {
	const closeSheet = () => {
		TrueSheet.dismiss(NAMES.sheets.createTraining);
	};
	const [filterId, setFilterId] = useState<string | undefined>(undefined);
	const [date, setDate] = useState(new Date());
	const createWorkout = useMutation(api.workouts.createWorkout);
	const router = useRouter();

	const isDisabled = filterId === undefined;

	const createTraining = async () => {
		if (filterId !== undefined) {
			const isoDate = toLocalISODateString(date);
			const workoutId = await createWorkout({
				workoutDate: isoDate,
				filterId: filterId as Id<"filters">,
			});
			if (workoutId) {
				closeSheet();
				setFilterId(undefined);
				setDate(new Date());
				router.navigate({ pathname: "/(auth)/training/[id]", params: { id: workoutId.workoutId } });
			}
		}
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.6, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={isDisabled}
					onPress={createTraining}
					style={{ backgroundColor: isDisabled ? COLORS.disabled : COLORS.accent }}
				>
					<Ionicons color="white" name="add" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Vytvořit</Text>
					<Text className="-ml-0.5 text-center font-bold text-lg text-text">trénink</Text>
				</TouchableOpacity>
			}
			footerStyle={{ paddingHorizontal: 16 }}
			name={NAMES.sheets.createTraining}
		>
			<View className="px-4 pt-8 pb-2">
				<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
					<Ionicons color={COLORS.accent} name="add-circle-outline" size={26} />
					<Text className="font-bold text-text text-xl">Nový trénink</Text>
				</View>
				<View className="gap-4">
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
