import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation, useQuery } from "convex/react";
import { NotebookPen } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type EditNoteProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	routineExerciseId: string;
	closeParent: () => void;
};

export default function EditNoteModal({ visible, setVisible, routineExerciseId, closeParent }: EditNoteProps) {
	const name = `${NAMES.sheets.routineEditNote}-${routineExerciseId}`;
	const closeSheet = () => {
		setVisible(false);
	};
	const routineExercise = useQuery(api.routineExercises.getRoutineExerciseById, {
		routineExerciseId: routineExerciseId as Id<"routinesExercises">,
	});
	const [note, setNote] = useState<string | undefined>(routineExercise?.note);
	const editNote = useMutation(api.routineExercises.editNote).withOptimisticUpdate((localStore, args) => {
		const queries = localStore.getAllQueries(api.routines.getRoutineById);
		for (const query of queries) {
			const currentData = query.value;
			if (currentData?.exercises) {
				const updatedExercises = currentData.exercises.map((exercise) =>
					exercise._id === args.routineExerciseId ? { ...exercise, note: args.note } : exercise
				);
				localStore.setQuery(api.routines.getRoutineById, query.args, {
					...currentData,
					exercises: updatedExercises,
				});
			}
		}
	});

	useEffect(() => {
		if (visible) {
			TrueSheet.present(name);
		} else {
			TrueSheet.dismiss(name);
		}
	}, [name, visible]);

	const disabled = note === routineExercise?.note;

	const handleEditNote = () => {
		editNote({
			routineExerciseId: routineExerciseId as Id<"routinesExercises">,
			note,
		});
		closeSheet();
		closeParent();
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.5, 0.7]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl px-4 py-3"
					disabled={disabled}
					onPress={handleEditNote}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<NotebookPen color="white" size={20} />
					<Text className="px-2 py-1 font-bold text-lg text-text">Upravit poznámku</Text>
				</TouchableOpacity>
			}
			name={name}
			onDidDismiss={closeSheet}
		>
			<View className="px-4 pt-8 pb-4">
				<View className="mt-2 mb-4 flex-row items-center gap-2 self-center">
					<NotebookPen color={COLORS.accent} size={20} />
					<Text className="font-bold text-text text-xl">Upravit poznámku</Text>
				</View>

				<View>
					<Text className="mb-2 font-semibold text-lg text-text">Poznámka</Text>
					<TextInput
						autoFocus
						className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
						cursorColorClassName="accent-text"
						defaultValue={routineExercise?.note || ""}
						maxLength={50}
						onChangeText={setNote}
						onSubmitEditing={() => {
							if (!disabled) {
								handleEditNote();
							}
						}}
						returnKeyType="done"
						value={note}
					/>
				</View>
			</View>
		</TrueSheet>
	);
}
