import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronUp, NotebookPen, Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import EditExerciseModal from "./edit-menu-modals/edit-exercise";
import EditNoteModal from "./edit-menu-modals/edit-note";

type RoutineMenuProps = {
	sheetVisible: boolean;
	setSheetVisible: (visible: boolean) => void;
	exerciseId: string;
	isFirst: boolean;
	isLast: boolean;
	order: number;
	routineId: string;
};

export default function RoutineMenuModal({
	sheetVisible,
	setSheetVisible,
	exerciseId,
	isFirst,
	isLast,
	order,
	routineId,
}: RoutineMenuProps) {
	const [edit, setEdit] = useState(false);
	const [note, setNote] = useState(false);
	const sheetName = `${NAMES.sheets.routineMenu}-${exerciseId}`;
	const closeSheet = () => setSheetVisible(false);

	useEffect(() => {
		if (sheetVisible) {
			TrueSheet.present(sheetName);
		} else {
			TrueSheet.dismiss(sheetName);
		}
	}, [sheetName, sheetVisible]);

	const deleteRoutineExercise = useMutation(api.routineExercises.deleteRoutineExercise).withOptimisticUpdate(
		(localStore, args) => {
			const queries = localStore.getAllQueries(api.routines.getRoutineById);
			for (const query of queries) {
				const currentData = query.value;
				if (currentData?.exercises && query.args.routineId === args.routineId) {
					const updatedExercises = currentData.exercises
						.filter((exercise) => exercise._id !== args.routineExerciseId)
						.map((exercise) => ({
							...exercise,
							order: exercise.order > args.order ? exercise.order - 1 : exercise.order,
						}));
					localStore.setQuery(api.routines.getRoutineById, query.args, {
						...currentData,
						exercises: updatedExercises,
					});
				}
			}
		}
	);
	const moveUp = useMutation(api.routineExercises.moveUp).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises && query.args.routineId === args.routineId) {
				const exercises = [...currentData.exercises];
				const currentIndex = exercises.findIndex((e) => e.order === args.order);
				if (currentIndex > 0) {
					[exercises[currentIndex - 1], exercises[currentIndex]] = [
						{ ...exercises[currentIndex], order: args.order - 1 },
						{ ...exercises[currentIndex - 1], order: args.order },
					];
					localStore.setQuery(api.routines.getRoutineById, query.args, {
						...currentData,
						exercises: exercises.sort((a, b) => a.order - b.order),
					});
				}
			}
		}
	});
	const moveDown = useMutation(api.routineExercises.moveDown).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises && query.args.routineId === args.routineId) {
				const exercises = [...currentData.exercises];
				const currentIndex = exercises.findIndex((e) => e.order === args.order);
				if (currentIndex < exercises.length - 1) {
					[exercises[currentIndex], exercises[currentIndex + 1]] = [
						{ ...exercises[currentIndex + 1], order: args.order },
						{ ...exercises[currentIndex], order: args.order + 1 },
					];
					localStore.setQuery(api.routines.getRoutineById, query.args, {
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
				routineExerciseId: exerciseId as Id<"routinesExercises">,
				routineId: routineId as Id<"routines">,
				order,
			});
			closeSheet();
		}
	};

	const handleMoveDown = () => {
		if (!isLast) {
			moveDown({
				routineExerciseId: exerciseId as Id<"routinesExercises">,
				routineId: routineId as Id<"routines">,
				order,
			});
			closeSheet();
		}
	};

	const handleDeleteExercise = () => {
		deleteRoutineExercise({
			routineExerciseId: exerciseId as Id<"routinesExercises">,
			routineId: routineId as Id<"routines">,
			order,
		});
		closeSheet();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.6, 0.7]}
			dimmedDetentIndex={0.1}
			name={sheetName}
			onDidDismiss={closeSheet}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-1 gap-4">
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

			<EditExerciseModal
				closeParent={closeSheet}
				routineExerciseId={exerciseId}
				setVisible={setEdit}
				visible={edit}
			/>

			<EditNoteModal
				closeParent={closeSheet}
				routineExerciseId={exerciseId}
				setVisible={setNote}
				visible={note}
			/>
		</TrueSheet>
	);
}
