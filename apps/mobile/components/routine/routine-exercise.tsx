import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import RoutineMenuModal from "./modals/routine-menu-modals";

type ExerciseProps = {
	_id: string;
	exerciseId: Id<"exercises"> | undefined;
	name: string | undefined;
	muscleGroup: string | null | undefined;
	note: string | undefined;
	isEdit: boolean;
	exercisesLength: number;
	order: number;
	routineId: string;
};

export default function RoutineExercise({
	_id,
	exerciseId,
	name,
	muscleGroup,
	note,
	isEdit,
	exercisesLength,
	order,
	routineId,
}: ExerciseProps) {
	const [editMenu, setEditMenu] = useState(false);
	const router = useRouter();

	const handleNavigateToHistory = () => {
		router.push({
			pathname: "/(auth)/(tabs)/stats/history",
			params: { exerciseId, routineId },
		});
	};

	return (
		<View className="py-4">
			<View className="mb-0 flex-row items-center">
				<View className="flex-1 flex-row items-center">
					<TouchableOpacity onPress={handleNavigateToHistory}>
						<Text className="flex font-semibold text-[19px] text-text">{name}</Text>
					</TouchableOpacity>
					{isEdit && (
						<TouchableOpacity
							className="ml-2 rounded-full bg-secondary p-1.5"
							onPress={() => setEditMenu(true)}
						>
							<Pencil color="white" size={14} />
						</TouchableOpacity>
					)}
				</View>

				<Text className="rounded-xl border border-muted/25 px-2 py-1 font-light text-muted text-xs">
					{muscleGroup}
				</Text>
			</View>
			{note && <Text className="mt-2 text-muted">{note}</Text>}
			<RoutineMenuModal
				exerciseId={_id}
				isFirst={order === 0}
				isLast={order === exercisesLength - 1}
				order={order}
				routineId={routineId}
				setSheetVisible={setEditMenu}
				sheetVisible={editMenu}
			/>
		</View>
	);
}
