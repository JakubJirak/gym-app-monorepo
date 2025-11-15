import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditSetModal from "./modals/edit-set";

type ExerciseSetProps = {
	order: number;
	weight: number;
	reps: number;
	isEdit: boolean;
	setId: string;
};

export default function ExerciseSet({ order, weight, reps, isEdit, setId }: ExerciseSetProps) {
	const [edit, setEdit] = useState(false);

	return (
		<View className="my-1.5 flex-row items-center rounded-xl bg-secondary px-4 py-2.5">
			<Text className="flex-1 text-text">{order + 1}. série</Text>
			<Text className="font-semibold text-text">
				{weight}kg × {reps}
			</Text>
			{isEdit && (
				<TouchableOpacity className="ml-2 rounded-full bg-secondary" onPress={() => setEdit(true)}>
					<Pencil color="white" size={14} />
				</TouchableOpacity>
			)}
			<EditSetModal
				defaultReps={reps}
				defaultWeight={weight}
				setId={setId}
				setVisible={setEdit}
				visible={edit}
			/>
		</View>
	);
}
