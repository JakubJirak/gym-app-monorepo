import { Pencil } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type ExerciseProps = {
	name: string;
	usageCount: number;
	editable: boolean;
	onPress: () => void;
};

export default function Exercise({ name, usageCount, editable, onPress }: ExerciseProps) {
	if (editable) {
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3"
				onPress={onPress}
			>
				<Text className="flex-1 text-base text-text">{name}</Text>
				<Text className="text-base text-muted">{usageCount}x</Text>
				<View className="ml-4">
					<Pencil color="white" size={18} />
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<View className="mb-2 flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3">
			<Text className="flex-1 text-base text-text">{name}</Text>
			<Text className="text-base text-muted">{usageCount}x</Text>
		</View>
	);
}
