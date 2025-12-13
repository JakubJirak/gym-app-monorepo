import { useRouter } from "expo-router";
import { Pencil, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import EditMenuModal from "./modals/edit-menu";
import AddSetModal from "./modals/edit-menu-modals/add-set";
import ExerciseSet from "./set";

type ExerciseProps = {
	_id: string;
	exerciseId: string;
	name: string;
	muscleGroup: string | null;
	note: string | undefined;
	isEdit: boolean;
	exercisesLength: number;
	order: number;
	trainingId: string;
	sets:
		| {
				_id: string;
				reps: number;
				weight: number;
				order: number;
		  }[]
		| null;
};

export default function Exercise({
	_id,
	exerciseId,
	name,
	muscleGroup,
	sets,
	note,
	isEdit,
	exercisesLength,
	order,
	trainingId,
}: ExerciseProps) {
	const [editMenu, setEditMenu] = useState(false);
	const [addSetModal, setAddSetModal] = useState(false);
	const router = useRouter();

	const handleNavigateToHistory = () => {
		router.push({
			pathname: "/(auth)/(tabs)/stats/history",
			params: { exerciseId, trainingId },
		});
	};

	return (
		<View className="py-4">
			<View className="mb-2 flex-row items-center">
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
			{sets && sets.length > 0 ? (
				<>
					<FlatList
						data={sets}
						keyExtractor={(item) => item._id}
						renderItem={({ item }) => (
							<ExerciseSet
								isEdit={isEdit}
								order={item.order}
								reps={item.reps}
								setId={item._id}
								weight={item.weight}
							/>
						)}
					/>
					{isEdit && (
						<TouchableOpacity
							activeOpacity={0.7}
							className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-secondary py-2"
							onPress={() => setAddSetModal(true)}
						>
							<Plus color={COLORS.muted} size={20} />
							<Text className="text-base text-muted">Přidat sérii</Text>
						</TouchableOpacity>
					)}
				</>
			) : (
				<TouchableOpacity
					activeOpacity={0.7}
					className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-secondary py-2"
					onPress={() => setAddSetModal(true)}
				>
					<Plus color={COLORS.muted} size={20} />
					<Text className="text-base text-muted">Přidat sérii</Text>
				</TouchableOpacity>
			)}
			{note && <Text className="mt-2 text-muted">{note}</Text>}
			<AddSetModal
				closeParent={() => setAddSetModal(false)}
				setsLength={sets?.length}
				setVisible={setAddSetModal}
				visible={addSetModal}
				workoutExerciseId={_id}
			/>
			<EditMenuModal
				exerciseId={_id}
				isFirst={order === 0}
				isLast={order === exercisesLength - 1}
				order={order}
				setSheetVisible={setEditMenu}
				setsLength={sets?.length}
				sheetVisible={editMenu}
				trainingId={trainingId}
			/>
		</View>
	);
}
