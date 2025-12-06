import { FlatList, Text, View } from "react-native";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type HistoryExerciseProps = {
	name: string;
	note: string | undefined;
	sets: {
		_id: Id<"sets">;
		reps: number;
		weight: number;
		order: number;
	}[];
};

export default function HistoryExercise({ name, note, sets }: HistoryExerciseProps) {
	return (
		<View className="py-4">
			<View className="mb-1 flex-row items-center">
				<View className="flex-1 flex-row items-center">
					<Text className="flex font-semibold text-lg text-text">{name}</Text>
				</View>
			</View>
			<FlatList
				data={sets}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<View className="my-1 flex-row items-center rounded-xl bg-secondary px-4 py-2.5">
						<Text className="flex-1 text-text">{item.order + 1}. série</Text>
						<Text className="font-semibold text-text">
							{item.weight}kg × {item.reps}
						</Text>
					</View>
				)}
			/>
			{note ? (
				<View className="mt-2">
					<Text className="text-muted">{note}</Text>
				</View>
			) : null}
		</View>
	);
}
