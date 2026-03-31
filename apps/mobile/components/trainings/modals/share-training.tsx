import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { setStringAsync } from "expo-clipboard";
import { Share2 } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type ShareTrainingModalProps = {
	trainingId: string;
	isShared: boolean;
	sheetName?: string;
};

export default function ShareTrainingModal({ trainingId, isShared, sheetName }: ShareTrainingModalProps) {
	const sheetId = sheetName ?? `${NAMES.sheets.trainingShare}-${trainingId}`;
	const shareLink = `https://gymtracker.jirak.dev/shared/${trainingId}`;

	const closeSheet = () => {
		TrueSheet.dismiss(sheetId);
	};

	const shareWorkout = useMutation(api.workouts.shareWorkout).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const current = query.value;
			if (current && query.args.workoutId === args.workoutId) {
				localStore.setQuery(api.workouts.getWorkoutById, query.args, {
					...current,
					isShared: true,
				});
			}
		}
	});

	const disableSharing = useMutation(api.workouts.disableWorkoutSharing).withOptimisticUpdate(
		(localStore, args) => {
			const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
			for (const query of queries) {
				const current = query.value;
				if (current && query.args.workoutId === args.workoutId) {
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...current,
						isShared: false,
					});
				}
			}
		}
	);

	const handleToggleSharing = () => {
		if (isShared) {
			disableSharing({ workoutId: trainingId as Id<"workouts"> });
		} else {
			shareWorkout({ workoutId: trainingId as Id<"workouts"> });
		}
		closeSheet();
	};

	const handleCopyLink = async () => {
		await setStringAsync(shareLink);
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.4, 0.6]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					onPress={handleToggleSharing}
					style={{
						backgroundColor: COLORS.accent,
					}}
				>
					<Share2 color="white" size={18} />
					<Text className="px-2 py-1 font-bold text-lg text-text">
						{isShared ? "Přestat sdílet" : "Sdílet trenink"}
					</Text>
				</TouchableOpacity>
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mb-4 flex-row items-center justify-center gap-2.5">
					<Share2 color={COLORS.accent} size={20} />
					<Text className="font-bold text-text text-xl">
						{isShared ? "Přestat sdílet" : "Sdílet trenink"}
					</Text>
				</View>

				<View className="h-14 flex-row items-center gap-2">
					<View className="flex-1 rounded-xl bg-secondary p-2">
						<TextInput
							className="rounded-lg bg-secondary px-2 text-muted text-sm"
							editable={false}
							value={shareLink}
						/>
					</View>
					<TouchableOpacity
						className="h-full w-14 items-center justify-center rounded-lg border border-border"
						onPress={handleCopyLink}
					>
						<Ionicons color="white" name="copy-outline" size={22} />
					</TouchableOpacity>
				</View>
			</View>
		</TrueSheet>
	);
}
