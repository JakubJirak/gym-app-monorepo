import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditExerciseModal from "./edit-exercise";

type ExerciseProps = {
	name: string;
	exerciseId: string;
	usageCount: number;
};

export default function Exercise({ name, exerciseId, usageCount }: ExerciseProps) {
	const [edit, setEdit] = useState(false);
	return (
		<View className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4">
			<Text className="flex-1 text-base text-text">{name}</Text>
			<Text className="text-base text-muted">{usageCount}x</Text>
			<TouchableOpacity className="ml-4 rounded-full bg-secondary py-3.5" onPress={() => setEdit(true)}>
				<Pencil color="white" size={18} />
			</TouchableOpacity>
			<EditExerciseModal
				exerciseId={exerciseId}
				exerciseName={name}
				setSheetVisible={setEdit}
				sheetVisible={edit}
			/>
		</View>
	);
}
