import { FlatList, Text, View } from "react-native";
import ExerciseSet from "./set";

type ExerciseProps = {
	name: string;
	muscleGroup: string | null;
	note: string | undefined;
	sets:
		| {
				_id: string;
				reps: number;
				weight: number;
				order: number;
		  }[]
		| null;
};

export default function Exercise({ name, muscleGroup, sets, note }: ExerciseProps) {
	return (
		<View className="py-4">
			<View className="mb-2 flex-row items-center">
				<Text className="flex-1 font-semibold text-text text-xl">{name}</Text>
				<Text className="rounded-xl border border-inactive px-2 py-1 font-light text-muted">
					{muscleGroup}
				</Text>
			</View>
			<FlatList
				data={sets}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<ExerciseSet order={item.order} reps={item.reps} weight={item.weight} />
				)}
			/>
			{note && <Text className="mt-2 text-muted">{note}</Text>}
		</View>
	);
}
