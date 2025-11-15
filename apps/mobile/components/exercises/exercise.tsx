import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditExerciseModal from "./edit-exercise";

type ExerciseProps = {
	name: string;
	exerciseId: string;
};

export default function Exercise({ name, exerciseId }: ExerciseProps) {
	const [edit, setEdit] = useState(false);
	return (
		<View className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3">
			<Text className="text-base text-text">{name}</Text>
			<TouchableOpacity className="ml-2 rounded-full bg-secondary" onPress={() => setEdit(true)}>
				<Pencil color="white" size={16} />
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
