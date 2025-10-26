import { COLORS } from "@/constants/COLORS";
import { Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";

export default function Goal({
	name,
	pr,
	goal,
}: {
	name: string;
	pr: number;
	goal: number;
}) {
	return (
		<View>
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-white text-base">
					{name} ({goal}kg)
				</Text>
				<Text className="text-white text-base">
					{((pr / goal) * 100).toFixed(0)}%
				</Text>
			</View>
			<ProgressBar progress={pr / goal} color={COLORS.accent} />
		</View>
	);
}
