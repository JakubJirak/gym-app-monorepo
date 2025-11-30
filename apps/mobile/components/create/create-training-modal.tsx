import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
	const [name, setName] = useState("");
	const createWorkout = useMutation(api.workouts.createWorkout);
	const router = useRouter();

	const isDisabled = name.trim() === "" || filterId === undefined;

	const createTraining = async () => {
		if (filterId !== undefined) {
			const isoDate = toLocalISODateString(date);
			const workoutId = await createWorkout({
				name: name.trim(),
				workoutDate: isoDate,
				filterId: filterId as Id<"filters">,
			});
			if (workoutId) {
				closeSheet();
				setName("");
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
			<View className="h-[75%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<Text className="mt-2 mb-6 text-center font-bold text-text text-xl">Nový trénink</Text>
				<View className="gap-4">
					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Název tréninku</Text>
						<TextInput
							className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
							cursorColorClassName="accent-text"
							maxLength={50}
							onChangeText={setName}
							value={name}
						/>
					</View>
					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Datum</Text>
						<DatePicker date={date} setDate={setDate} />
					</View>
					<View>
						<Text className="mb-2 font-semibold text-lg text-text">Filtr</Text>
						<FilterDropdown onChange={setFilterId} value={filterId} />
					</View>
				</View>

				<Pressable
					className="mt-auto mb-8 rounded-2xl py-3"
					disabled={isDisabled}
					onPress={createTraining}
					style={{ backgroundColor: isDisabled ? COLORS.disabled : COLORS.accent }}
				>
					<Text className="text-center font-bold text-text text-xl">Vytvořit trénink</Text>
				</Pressable>
			</View>
		</Modal>
	);
}
