import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type MenuModalProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	trainingId: string;
};

export default function DeleteTrainingModal({ sheetVisible, setSheetVisible, trainingId }: MenuModalProps) {
	const closeSheet = () => setSheetVisible(false);
	const deleteTraining = useMutation(api.workouts.deleteWorkout);
	const router = useRouter();

	const handleDeleteTraining = () => {
		router.navigate({ pathname: "/trainings" });
		deleteTraining({ workoutId: trainingId as Id<"workouts"> });
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[33%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 items-center justify-between">
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="white" name="trash-outline" size={24} />
						<Text className="font-bold text-2xl text-text">Smazat trénink</Text>
					</View>

					<Text className="text-center text-muted">
						Tato akce se nedá navrátit. Navžy smaže váš trénink se všemi cviky, sériemi a
						poznámkami.
					</Text>

					<View className="mt-4 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl bg-destructive"
							onPress={handleDeleteTraining}
						>
							<Ionicons color="white" name="trash-outline" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Smazat trénink</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
