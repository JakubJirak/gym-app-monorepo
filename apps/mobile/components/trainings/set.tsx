import { Text, View } from "react-native";

interface ExerciseSetProps {
	order: number;
	weight: string;
	reps: number;
}

export default function ExerciseSet({ order, weight, reps }: ExerciseSetProps) {
	return (
		<View className="bg-secondary py-2.5 my-1.5 px-4 rounded-xl flex-row">
			<Text className="text-white flex-1">{order + 1}. série</Text>
			<Text className="text-white font-semibold">
				{weight}kg × {reps}
			</Text>
		</View>
	);
}
