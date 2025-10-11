import { FlatList, Text, View } from "react-native";
import ExerciseSet from "./set";

interface ExerciseProps {
	name: string;
	muscleGroup: string;
	note: string | null;
	sets:
		| {
				id: string;
				workoutExerciseId: string;
				weight: string;
				reps: number;
				order: number;
		  }[]
		| {
				id: string;
				workoutExerciseId: string;
				weight: string;
				reps: number;
				order: number;
		  }[];
}

export default function Exercise({
	name,
	muscleGroup,
	sets,
	note,
}: ExerciseProps) {
	return (
		<View className="py-4">
			<View className="flex-row items-center mb-2">
				<Text className="text-white flex-1 text-xl font-semibold">{name}</Text>
				<Text className="text-white border-2 border-secondary px-2 py-1 rounded-xl">
					{muscleGroup}
				</Text>
			</View>
			<FlatList
				data={sets}
				renderItem={({ item }) => (
					<ExerciseSet
						order={item.order}
						weight={item.weight}
						reps={item.reps}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>
			{note && <Text className="text-muted mt-2">{note}</Text>}
		</View>
	);
}
