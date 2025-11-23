import { Link } from "expo-router";
import { Calendar, ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";
import StatsCalendar from "@/components/stats/calendar";

export default function Stats() {
	return (
		<View className="flex-1 bg-primary px-4">
			<Text className="text-text">celkove statistiky, powerlifting historie</Text>
			<View>
				<Link className="mt-6 mb-4" href="/(auth)/(tabs)/stats/calendar">
					<View className="w-full flex-row items-center gap-3">
						<Calendar color="white" size={24} />
						<Text className="font-bold text-2xl text-white">Kalendář tréninků</Text>
						<View className="ml-auto">
							<ChevronRight color="white" size={30} />
						</View>
					</View>
				</Link>
				<StatsCalendar />
			</View>
		</View>
	);
}
