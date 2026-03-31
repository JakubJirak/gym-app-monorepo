import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Pencil } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { NAMES } from "@/constants/NAMES";
import EditExerciseModal from "./edit-exercise";

type ExerciseProps = {
	name: string;
	exerciseId: string;
	usageCount: number;
	userId: string;
};

export default function Exercise({ name, exerciseId, usageCount, userId }: ExerciseProps) {
	const isEditable = userId !== "default";
	const editExerciseSheetName = `${NAMES.sheets.editExercise}-${exerciseId}`;

	if (isEditable) {
		return (
			<>
				<TouchableOpacity
					activeOpacity={0.7}
					className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3"
					onPress={() => TrueSheet.present(editExerciseSheetName)}
				>
					<Text className="flex-1 text-base text-text">{name}</Text>
					<Text className="text-base text-muted">{usageCount}x</Text>
					<View className="ml-4">
						<Pencil color="white" size={18} />
					</View>
				</TouchableOpacity>
				<EditExerciseModal
					exerciseId={exerciseId}
					exerciseName={name}
					sheetName={editExerciseSheetName}
					usageCount={usageCount}
				/>
			</>
		);
	}

	return (
		<View className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3">
			<Text className="flex-1 text-base text-text">{name}</Text>
			<Text className="text-base text-muted">{usageCount}x</Text>
		</View>
	);
}
