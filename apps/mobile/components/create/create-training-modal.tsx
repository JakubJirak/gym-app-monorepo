import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import DatePicker from "../forms/date-picker";
import FilterDropdown from "../forms/filters-dropdown";

type CreateTrainingModalProps = {
	createModalVisible: boolean;
	setCreateModalVisible: (visible: boolean) => void;
};

export default function CreateTrainingModal({ createModalVisible, setCreateModalVisible }: CreateTrainingModalProps) {
	const closeSheet = () => setCreateModalVisible(false);
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
				router.navigate({ pathname: "/(auth)/[id]", params: { id: workoutId.workoutId } });
			}
		}
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={createModalVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[60%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<Text className="mt-2 mb-6 text-center font-bold text-text text-xl">Nový trénink</Text>
				<View className="gap-4">
					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Datum</Text>
						<DatePicker date={date} setDate={setDate} />
					</View>
					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Filtr</Text>
						<FilterDropdown onChange={setFilterId} value={filterId} />
					</View>
				</View>

				<TouchableOpacity
					className="mt-auto mb-8 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={isDisabled}
					onPress={createTraining}
					style={{ backgroundColor: isDisabled ? COLORS.disabled : COLORS.accent }}
				>
					<Ionicons color="white" name="add" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-text text-xl">Vytvořit</Text>
					<Text className="-ml-0.5 text-center font-bold text-text text-xl">trénink</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
}
