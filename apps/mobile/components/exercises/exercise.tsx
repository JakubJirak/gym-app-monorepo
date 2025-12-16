import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditExerciseModal from "./edit-exercise";

type ExerciseProps = {
	name: string;
	exerciseId: string;
	usageCount: number;
	userId: string;
};

export default function Exercise({ name, exerciseId, usageCount, userId }: ExerciseProps) {
	const [edit, setEdit] = useState(false);
	const isEditable = userId !== "default";

	if (isEditable) {
		return (
			<>
				<TouchableOpacity
					activeOpacity={0.7}
					className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3"
					onPress={() => setEdit(true)}
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
					setSheetVisible={setEdit}
					sheetVisible={edit}
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
