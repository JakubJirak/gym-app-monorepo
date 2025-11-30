import { Info } from "lucide-react-native";
import { Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";

export default function About() {
	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="O aplikaci" />

			<View className="mt-4 flex-row items-center gap-4 rounded-xl bg-secondary p-4">
				<Info color="white" size={24} />
				<View className="flex-1 flex-row items-center justify-between">
					<Text className="font-semibold text-lg text-text">Verze</Text>
					<Text className="text-base text-muted">1.0</Text>
				</View>
			</View>
		</View>
	);
}
