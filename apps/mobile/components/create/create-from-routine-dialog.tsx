import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Layers } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DatePicker from "@/components/forms/date-picker";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type CreateFromRoutineDialogProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	routineId: string | null;
	routineName: string | null;
	routineColor: string | null;
};

export default function CreateFromRoutineDialog({
	visible,
	setVisible,
	routineId,
	routineName,
	routineColor,
}: CreateFromRoutineDialogProps) {
	const [date, setDate] = useState(new Date());
	const router = useRouter();
	const closeSheet = () => setVisible(false);
	const createWorkout = useMutation(api.routines.createWorkoutFromRoutine);

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
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[60%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
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

					<View className="mt-8 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border py-3"
							onPress={closeSheet}
						>
							<Text className="text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center gap-2 rounded-xl bg-accent"
							onPress={handleCreateWorkout}
						>
							<Layers color="white" size={20} />
							<Text className="w-[60%] font-semibold text-lg text-text">
								Vytvořit trénink
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
