import { Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { COLORS } from "@/constants/COLORS";

export default function Goal({ name, pr, goal }: { name: string; pr: number; goal: number }) {
	const nasobek = 100;
	return (
		<View>
			<View className="mb-2 flex-row items-center justify-between">
				<Text className="text-base text-text">
					{name} ({goal}kg)
				</Text>
				<Text className="text-base text-text">{((pr / goal) * nasobek).toFixed(0)}%</Text>
			</View>
			<ProgressBar color={COLORS.accent} progress={pr / goal} />
		</View>
	);
}
