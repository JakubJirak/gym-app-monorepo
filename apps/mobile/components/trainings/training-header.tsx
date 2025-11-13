import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import EditTrainingModal from "./modals/edit-training";

export default function TrainingHeader({ text, trainingId }: { text: string; trainingId: string }) {
	const router = useRouter();
	const [openEdit, setOpenEdit] = useState(false);
	const training = useQuery(api.workouts.getWorkoutById, { workoutId: trainingId as Id<"workouts"> });

	return (
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color="white" name="chevron-back" size={28} />
			</TouchableOpacity>
			<Text className="ml-4 flex-1 font-semibold text-2xl text-text">{text}</Text>
			<TouchableOpacity className="w-8" onPress={() => setOpenEdit(true)}>
				<Pencil color="white" size={22} />
			</TouchableOpacity>
			<EditTrainingModal
				defaultDate={training?.workoutDate}
				defaultFilterId={training?.filter?._id}
				defaultName={training?.name}
				setSheetVisible={setOpenEdit}
				sheetVisible={openEdit}
				trainingId={trainingId}
			/>
		</View>
	);
}
