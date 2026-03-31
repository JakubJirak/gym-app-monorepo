import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type MenuModalProps = {
	trainingId: string;
	sheetName?: string;
};

export default function DeleteTrainingModal({ trainingId, sheetName }: MenuModalProps) {
	const name = sheetName ?? NAMES.sheets.deleteTraining;
	const closeSheet = () => {
		TrueSheet.dismiss(name);
	};
	const deleteTraining = useMutation(api.workouts.deleteWorkout).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			if (query.args.workoutId === args.workoutId) {
				localStore.setQuery(api.workouts.getWorkoutById, query.args, undefined);
			}
		}
	});
	const router = useRouter();

	const handleDeleteTraining = () => {
		router.navigate({ pathname: "/trainings" });
		deleteTraining({ workoutId: trainingId as Id<"workouts"> });
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={["auto"]}
			dimmedDetentIndex={0.1}
			footer={() => (
				<TouchableOpacity
					className="mb-6 flex-row items-center justify-center rounded-2xl bg-destructive px-4 py-3"
					onPress={handleDeleteTraining}
				>
					<Ionicons color="white" name="trash-outline" size={28} />
					<Text className="px-2 py-1 text-center font-bold text-lg text-text">Smazat trénink</Text>
				</TouchableOpacity>
			)}
			footerStyle={{ paddingHorizontal: 16 }}
			name={name}
		>
			<View className="px-4 pt-8 pb-18">
				<View className="mt-1 mb-4 flex-row items-center justify-center gap-2">
					<Ionicons color="white" name="trash-outline" size={20} />
					<Text className="font-bold text-text text-xl">Smazat</Text>
					<Text className="font-bold text-text text-xl">trénink</Text>
				</View>

				<Text className="mb-8 px-4 text-center text-muted">
					Tato akce se nedá navrátit. Navždy smaže váš trénink se všemi cviky, sériemi a poznámkami.
				</Text>

				<View className="flex-row" />
			</View>
		</TrueSheet>
	);
}
