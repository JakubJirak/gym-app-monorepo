import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Layers, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import CreateFromRoutineDialog from "./create-from-routine-dialog";

type TrainingRoutineModalProps = {
	trainingRoutineModalVisible: boolean;
	setTrainingRoutineModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	closeParentSheet: () => void;
};

export default function TrainingRoutineModal({
	trainingRoutineModalVisible,
	setTrainingRoutineModalVisible,
	closeParentSheet,
}: TrainingRoutineModalProps) {
	const router = useRouter();
	const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
	const [selectedRoutine, setSelectedRoutine] = useState<{
		id: string;
		name: string;
		color?: string;
	} | null>(null);
	const routines = useQuery(api.routines.getUserRoutines);
	const closeSheet = () => setTrainingRoutineModalVisible(false);

	const handleSelectRoutine = (id: string, name: string, color?: string) => {
		setSelectedRoutine({ id, name, color });
		setConfirmDialogVisible(true);
		closeSheet();
	};

	return (
		<>
			<Modal
				animationIn="slideInUp"
				animationOut="slideOutDown"
				backdropOpacity={0.5}
				backdropTransitionOutTiming={0}
				hideModalContentWhileAnimating
				isVisible={trainingRoutineModalVisible}
				onBackButtonPress={closeSheet}
				onBackdropPress={closeSheet}
				onSwipeComplete={closeSheet}
				propagateSwipe
				style={{ justifyContent: "flex-end", margin: 0 }}
				swipeDirection={["down"]}
				useNativeDriver
				useNativeDriverForBackdrop
			>
				<View className="h-[80%] rounded-t-xl bg-darker p-4">
					<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Layers color={COLORS.accent} size={22} />
						<Text className="font-bold text-text text-xl">Vyberte rutinu</Text>
					</View>

					<FlatList
						className="flex-1"
						data={routines}
						ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
						keyExtractor={(item) => item._id}
						ListEmptyComponent={() => (
							<View className="mx-auto mt-10 gap-4">
								<Text className="text-center text-base text-muted">
									Zatím nemáte žádné rutiny
								</Text>
								<TouchableOpacity
									activeOpacity={0.7}
									className="mx-auto flex flex-row items-center gap-2 rounded-xl bg-secondary px-6 py-3"
									onPress={() => {
										closeSheet();
										closeParentSheet();
										router.push("/(auth)/(tabs)/profile/rutiny");
									}}
								>
									<Plus color="white" size={20} />
									<Text className="font-semibold text-lg text-text">
										Vytvořit rutinu
									</Text>
								</TouchableOpacity>
							</View>
						)}
						renderItem={({ item }) => (
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() =>
									handleSelectRoutine(item._id, item.name, item.filter?.color)
								}
							>
								<View className="flex-row items-center px-2 py-5">
									<View
										style={{
											backgroundColor: item.filter?.color || "gray",
											width: 3,
											height: "100%",
											borderRadius: 8,
											marginRight: 24,
											opacity: 0.8,
										}}
									/>
									<View className="flex-1 gap-1">
										<Text className="font-semibold text-lg text-text">
											{item.name}
										</Text>
									</View>
									<View className="flex-col justify-between">
										<Text
											className="rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
											style={{
												borderColor: `${item.filter?.color ? `${item.filter.color}99` : "gray"}`,
											}}
										>
											{item.filter?.name || "Žádný"}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			</Modal>

			<CreateFromRoutineDialog
				closeParentSheet={closeParentSheet}
				routineColor={selectedRoutine?.color || null}
				routineId={selectedRoutine?.id || null}
				routineName={selectedRoutine?.name || null}
				setVisible={setConfirmDialogVisible}
				visible={confirmDialogVisible}
			/>
		</>
	);
}
