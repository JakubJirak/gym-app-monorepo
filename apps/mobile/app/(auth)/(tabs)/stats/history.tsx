import { View } from "react-native";
import ComponentHeader from "@/components/component-header";
import History from "@/components/stats/history";

export default function StatsHistory() {
	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/stats" text="Historie tréninků" />
			<History />
		</View>
	);
}
