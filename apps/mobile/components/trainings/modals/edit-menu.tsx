import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronUp, NotebookPen, Pencil, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import AddSetModal from "./edit-menu-modals/add-set";
import EditExerciseModal from "./edit-menu-modals/edit-exercise";
import EditNoteModal from "./edit-menu-modals/edit-note";

type EditMenuProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	exerciseId: string;
	setsLength: number | undefined;
	isFirst: boolean;
	isLast: boolean;
	order: number;
	trainingId: string;
};

export default function EditMenuModal({
	sheetVisible,
	setSheetVisible,
	exerciseId,
	setsLength,
	isFirst,
	isLast,
	order,
	trainingId,
}: EditMenuProps) {
	const [set, setSet] = useState(false);
	const [edit, setEdit] = useState(false);
	const [note, setNote] = useState(false);
	const sheetName = `${NAMES.sheets.trainingEditMenu}-${exerciseId}`;
	const closeSheet = () => setSheetVisible(false);

	useEffect(() => {
		if (sheetVisible) {
			TrueSheet.present(sheetName);
		} else {
			TrueSheet.dismiss(sheetName);
		}
	}, [sheetName, sheetVisible]);

	const deleteWorkoutExercise = useMutation(api.workoutExercises.deleteWorkoutExercise).withOptimisticUpdate(
		(localStore, args) => {
			const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
			for (const query of queries) {
				const currentData = query.value;
				if (currentData?.exercises && query.args.workoutId === args.workoutId) {
					const updatedExercises = currentData.exercises
						.filter((exercise) => exercise._id !== args.workoutExerciseId)
						.map((exercise) => ({
							...exercise,
							order: exercise.order > args.order ? exercise.order - 1 : exercise.order,
						}));
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...currentData,
						exercises: updatedExercises,
					});
				}
			}
		}
	);
	const moveUp = useMutation(api.workoutExercises.moveUp).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises && query.args.workoutId === args.workoutId) {
				const exercises = [...currentData.exercises];
				const currentIndex = exercises.findIndex((e) => e.order === args.order);
				if (currentIndex > 0) {
					[exercises[currentIndex - 1], exercises[currentIndex]] = [
						{ ...exercises[currentIndex], order: args.order - 1 },
						{ ...exercises[currentIndex - 1], order: args.order },
					];
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...currentData,
						exercises: exercises.sort((a, b) => a.order - b.order),
					});
				}
			}
		}
	});
	const moveDown = useMutation(api.workoutExercises.moveDown).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.workouts.getWorkoutById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises && query.args.workoutId === args.workoutId) {
				const exercises = [...currentData.exercises];
				const currentIndex = exercises.findIndex((e) => e.order === args.order);
				if (currentIndex < exercises.length - 1) {
					[exercises[currentIndex], exercises[currentIndex + 1]] = [
						{ ...exercises[currentIndex + 1], order: args.order },
						{ ...exercises[currentIndex], order: args.order + 1 },
					];
					localStore.setQuery(api.workouts.getWorkoutById, query.args, {
						...currentData,
						exercises: exercises.sort((a, b) => a.order - b.order),
					});
				}
			}
		}
	});

	const handleMoveUp = () => {
		if (!isFirst) {
			moveUp({
				workoutExerciseId: exerciseId as Id<"workoutExercises">,
				workoutId: trainingId as Id<"workouts">,
				order,
			});
			closeSheet();
		}
	};

	const handleMoveDown = () => {
		if (!isLast) {
			moveDown({
				workoutExerciseId: exerciseId as Id<"workoutExercises">,
				workoutId: trainingId as Id<"workouts">,
				order,
			});
			closeSheet();
		}
	};

	const handleDeleteExercise = () => {
		deleteWorkoutExercise({
			workoutExerciseId: exerciseId as Id<"workoutExercises">,
			workoutId: trainingId as Id<"workouts">,
			order,
		});
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.6, 0.9]}
			dimmedDetentIndex={0.1}
			name={sheetName}
			onDidDismiss={closeSheet}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-1 gap-4">
					<TouchableOpacity
						className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]"
						onPress={() => setSet(true)}
					>
						<Plus color={COLORS.accent} size={24} />
						<Text className="text-lg text-white">Přidat sérii</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]"
						onPress={() => setEdit(true)}
					>
						<Pencil color={COLORS.accent} size={20} />
						<Text className="text-lg text-white">Změnit cvik</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="w-full flex-row items-center gap-2 rounded-xl bg-secondary px-3 py-2.5 pl-[25%]"
						onPress={() => setNote(true)}
					>
						<NotebookPen color={COLORS.accent} size={20} />
						<Text className="text-lg text-white">Upravit poznámku</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`${isFirst ? "bg-secondary/30" : "bg-secondary"} w-full flex-row items-center gap-2 rounded-xl px-3 py-2.5 pl-[23%]`}
						disabled={isFirst}
						onPress={handleMoveUp}
					>
						<ChevronUp color={COLORS.accent} size={28} />
						<Text className={`${isFirst ? "text-muted" : "text-text"} text-lg`}>
							Posunout nahoru
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`${isLast ? "bg-secondary/30" : "bg-secondary"} w-full flex-row items-center gap-2 rounded-xl px-3 py-2.5 pl-[23%]`}
						disabled={isLast}
						onPress={handleMoveDown}
					>
						<ChevronDown color={COLORS.accent} size={28} />
						<Text className={`${isLast ? "text-muted" : "text-text"} text-lg`}>
							Posunout dolů
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="w-full flex-row items-center gap-2 rounded-xl bg-destructive px-3 py-2.5 pl-[24%]"
						onPress={handleDeleteExercise}
					>
						<Ionicons color="white" name="trash-outline" size={24} />
						<Text className="text-lg text-white">Odstranit cvik</Text>
					</TouchableOpacity>
				</View>
			</View>

			<AddSetModal
				closeParent={closeSheet}
				setsLength={setsLength}
				setVisible={setSet}
				visible={set}
				workoutExerciseId={exerciseId}
			/>

			<EditExerciseModal
				closeParent={closeSheet}
				setVisible={setEdit}
				visible={edit}
				workoutExerciseId={exerciseId}
			/>

			<EditNoteModal
				closeParent={closeSheet}
				setVisible={setNote}
				visible={note}
				workoutExerciseId={exerciseId}
			/>
		</TrueSheet>
	);
}
