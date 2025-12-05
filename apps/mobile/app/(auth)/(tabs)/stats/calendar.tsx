import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import StatsCalendar from "@/components/stats/calendar";
import Training from "@/components/trainings/training";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function CalendarSite() {
	const params = useLocalSearchParams<{ selectedDate?: string }>();
	const initialDate = params.selectedDate || toLocalISODateString(new Date());
	const [currentDate, setCurrentDate] = useState(initialDate);
	const trainings = useQuery(api.workouts.getUserWorkouts);

	const filtered = trainings?.filter((workout) => workout.workoutDate === currentDate);

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/stats" text="Kalendář tréninků" />
			<FlatList
				data={filtered}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<View className="items-center justify-center py-8">
						<Text className="text-base text-muted">Pro tento den nemáte žádné tréninky</Text>
					</View>
				)}
				ListHeaderComponent={() => (
					<View className="mt-4">
						<StatsCalendar initialDate={currentDate} setCurrentDate={setCurrentDate} />
					</View>
				)}
				renderItem={({ item }) => (
					<Training date={item.workoutDate} filter={item.filter} id={item._id} note={item.name} />
				)}
			/>
		</View>
	);
}
