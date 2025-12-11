import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronUp, NotebookPen, Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import DeleteRoutineExerciseModal from "./edit-menu-modals/delete-routine-exercise";
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
	const [remove, setRemove] = useState(false);
	const closeSheet = () => setSheetVisible(false);
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

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			backdropOpacity={0.5}
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
			<View className="h-[53%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="mt-3 flex-1 gap-4">
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
						onPress={() => setRemove(true)}
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

			<DeleteRoutineExerciseModal
				closeParent={closeSheet}
				order={order}
				routineExerciseId={exerciseId}
				routineId={routineId}
				setVisible={setRemove}
				visible={remove}
			/>
		</Modal>
	);
}
