import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Layers, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import CreateFromRoutineDialog from "./create-from-routine-dialog";

export default function TrainingRoutineModal() {
	const router = useRouter();
	const [selectedRoutine, setSelectedRoutine] = useState<{
		id: string;
		name: string;
		color?: string;
	} | null>(null);
	const routines = useQuery(api.routines.getUserRoutines);
	const closeSheet = () => {
		TrueSheet.dismiss(NAMES.sheets.trainingRoutine);
	};

	const handleSelectRoutine = async (id: string, name: string, color?: string) => {
		setSelectedRoutine({ id, name, color });
		await TrueSheet.dismiss(NAMES.sheets.trainingRoutine);
		await TrueSheet.present(NAMES.sheets.createFromRoutine);
	};

	return (
		<>
			<TrueSheet
				backgroundColor={COLORS.darker}
				cornerRadius={24}
				detents={[0.7, 1]}
				dimmedDetentIndex={0.1}
				name={NAMES.sheets.trainingRoutine}
				scrollable
			>
				<View className="flex-1 p-4 pt-8">
					<View className="tems-center mt-2 mb-4 flex-row gap-3 self-center">
						<Layers color={COLORS.accent} size={22} />
						<Text className="font-bold text-text text-xl">Vyberte rutinu</Text>
					</View>

					<FlatList
						className="flex-1"
						contentContainerStyle={{ paddingBottom: 12 }}
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
									onPress={async () => {
										closeSheet();
										await TrueSheet.dismiss(NAMES.sheets.createMenu);
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
						nestedScrollEnabled
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
						scrollEnabled
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</TrueSheet>

			<CreateFromRoutineDialog
				routineColor={selectedRoutine?.color || null}
				routineId={selectedRoutine?.id || null}
				routineName={selectedRoutine?.name || null}
			/>
		</>
	);
}
