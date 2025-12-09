import { Stack } from "expo-router";
import { COLORS } from "@/constants/COLORS";

export default function StatsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: COLORS.primary,
				},
			}}
		/>
	);
}
