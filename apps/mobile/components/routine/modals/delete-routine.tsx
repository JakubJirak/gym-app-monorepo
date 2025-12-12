import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type DeleteRoutineModalProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	routineId: string;
};

export default function DeleteRoutineModal({ sheetVisible, setSheetVisible, routineId }: DeleteRoutineModalProps) {
	const closeSheet = () => setSheetVisible(false);
	const deleteRoutine = useMutation(api.routines.deleteRoutine).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		for (const query of queries) {
			if (query.args.routineId === args.routineId) {
				localStore.setQuery(api.routines.getRoutineById, query.args, undefined);
			}
		}
	});
	const router = useRouter();

	const handleDeleteRoutine = () => {
		router.navigate({ pathname: "/profile/rutiny" });
		deleteRoutine({ routineId: routineId as Id<"routines"> });
		closeSheet();
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
			backdropTransitionOutTiming={0}
			hideModalContentWhileAnimating
			isVisible={sheetVisible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View className="h-[33%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1 items-center justify-between">
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="white" name="trash-outline" size={24} />
						<Text className="font-bold text-2xl text-text">Smazat rutinu</Text>
					</View>

					<Text className="text-center text-muted">
						Tato akce se nedá navrátit. Navždy smaže vaši rutinu se všemi cviky a poznámkami.
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
							onPress={handleDeleteRoutine}
						>
							<Ionicons color="white" name="trash-outline" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Smazat rutinu</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
