import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Layers } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DatePicker from "@/components/forms/date-picker";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type CreateFromRoutineDialogProps = {
	routineId: string | null;
	routineName: string | null;
	routineColor: string | null;
};

export default function CreateFromRoutineDialog({
	routineId,
	routineName,
	routineColor,
}: CreateFromRoutineDialogProps) {
	const [date, setDate] = useState(new Date());
	const router = useRouter();
	const closeSheet = () => {
		TrueSheet.dismiss(NAMES.sheets.createFromRoutine);
	};
	const createWorkout = useMutation(api.routines.createWorkoutFromRoutine);
	const isDisabled = !routineId;

	const handleCreateWorkout = async () => {
		if (!routineId) {
			return;
		}

		const result = await createWorkout({
			routineId: routineId as Id<"routines">,
			name: "",
			workoutDate: toLocalISODateString(date),
		});

		if (result?.workoutId) {
			router.navigate({ pathname: "/(auth)/training/[id]", params: { id: result.workoutId } });
		}

		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.6, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mb-6 w-full flex-row items-center justify-center rounded-2xl py-4"
					disabled={isDisabled}
					onPress={handleCreateWorkout}
					style={{ backgroundColor: isDisabled ? COLORS.disabled : COLORS.accent }}
				>
					<Layers color="white" size={20} />
					<Text className="px-2 text-center font-bold text-lg text-text">Vytvořit</Text>
					<Text className="-ml-0.5 text-center font-bold text-lg text-text">trénink</Text>
				</TouchableOpacity>
			}
			footerStyle={{ paddingHorizontal: 16 }}
			name={NAMES.sheets.createFromRoutine}
		>
			<View className="px-4 pt-8 pb-2">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Layers color={COLORS.accent} size={22} />
						<Text className="font-bold text-text text-xl">Podle rutiny</Text>
					</View>

					<View className="gap-4">
						<View
							className="mt-2 flex-row items-center gap-3 rounded-xl border bg-secondary/50 px-4 py-4"
							style={{ borderColor: `${routineColor || COLORS.accent}40` }}
						>
							<Layers color={routineColor || COLORS.accent} size={20} />
							<Text className="flex-1 font-semibold text-lg text-text">{routineName}</Text>
						</View>

						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Datum</Text>
							<DatePicker date={date} setDate={setDate} />
						</View>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
