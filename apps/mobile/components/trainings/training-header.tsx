import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import ShareTrainingModal from "@/components/trainings/modals/share-training";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import EditTrainingModal from "./modals/edit-training";

export default function TrainingHeader({ text, trainingId }: { text: string; trainingId: string }) {
	const [menuVisible, setMenuVisible] = useState(false);
	const router = useRouter();
	const training = useQuery(api.workouts.getWorkoutById, { workoutId: trainingId as Id<"workouts"> });
	const shareSheetName = `${NAMES.sheets.trainingShare}-${trainingId}`;

	const closeMenu = () => setMenuVisible(false);
	const openEdit = () => {
		closeMenu();
		TrueSheet.present(NAMES.sheets.editTraining);
	};
	const openShare = () => {
		closeMenu();
		TrueSheet.present(shareSheetName);
	};

	return (
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color={COLORS.accent} name="chevron-back" size={24} />
			</TouchableOpacity>
			<Text className="ml-2 flex-1 font-semibold text-text text-xl">{text}</Text>
			<TouchableOpacity className="w-8" onPress={() => setMenuVisible((prev) => !prev)}>
				<Ionicons color="white" name="ellipsis-vertical" size={20} />
			</TouchableOpacity>

			<Modal animationType="none" onRequestClose={closeMenu} transparent visible={menuVisible}>
				<Pressable className="flex-1" onPress={closeMenu} />

				<View className="absolute top-12 right-4 z-50 min-w-44 overflow-hidden rounded-xl bg-darker px-2 py-2 shadow-md">
					<TouchableOpacity
						className="mb-3 flex-row items-center gap-3 px-3 pt-3"
						onPress={openEdit}
					>
						<Pencil color={COLORS.accent} size={18} />
						<Text className="text-base text-text">Upravit</Text>
					</TouchableOpacity>

					<TouchableOpacity className="flex-row items-center gap-3 px-3 pb-3" onPress={openShare}>
						<Ionicons color={COLORS.accent} name="share-social-outline" size={18} />
						<Text className="text-base text-text">
							{training?.isShared ? "Přestat sdílet" : "Sdílet"}
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<EditTrainingModal
				defaultDate={training?.workoutDate}
				defaultFilterId={training?.filter?._id}
				defaultName={training?.name}
				trainingId={trainingId}
			/>
			<ShareTrainingModal
				isShared={training?.isShared ?? false}
				sheetName={shareSheetName}
				trainingId={trainingId}
			/>
		</View>
	);
}
