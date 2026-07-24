import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import StatsCalendar from "@/components/stats/calendar";
import Training from "@/components/trainings/training";
import TrainingActions, { type ActionWorkout } from "@/components/trainings/training-actions";
import { COLORS } from "@/constants/COLORS";
import { getMonthDateRange, toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function CalendarSite() {
	const params = useLocalSearchParams<{ selectedDate?: string }>();
	const initialDate = params.selectedDate || toLocalISODateString(new Date());
	const [currentDate, setCurrentDate] = useState(initialDate);
	const [monthRange, setMonthRange] = useState(() => getMonthDateRange(initialDate.slice(0, 7)));
	const [selectedWorkout, setSelectedWorkout] = useState<ActionWorkout | null>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const calendarData = useQuery(api.workouts.getCalendarData, {
		startDate: monthRange.startDate,
		endDate: monthRange.endDate,
		selectedDate: currentDate,
	});
	const prefetchedMonth = calendarData?.calendar ?? {
		...monthRange,
		workoutDates: [],
	};
	const closeMenu = useCallback(() => setMenuVisible(false), []);

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/stats" text="Kalendář tréninků" />
			<FlatList
				data={calendarData?.workouts}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<View className="items-center justify-center py-8">
						{calendarData === undefined ? (
							<ActivityIndicator color={COLORS.accent} />
						) : (
							<Text className="text-base text-muted">
								Pro tento den nemáte žádné tréninky
							</Text>
						)}
					</View>
				)}
				ListHeaderComponent={() => (
					<View className="mt-4">
						<StatsCalendar
							initialDate={currentDate}
							onMonthRangeChange={setMonthRange}
							prefetchedMonth={prefetchedMonth}
							setCurrentDate={setCurrentDate}
						/>
					</View>
				)}
				renderItem={({ item }) => (
					<Training
						date={item.workoutDate}
						filter={item.filter}
						id={item._id}
						note={item.name}
						onLongPress={(position) => {
							setSelectedWorkout({
								_id: item._id,
								name: item.name,
								workoutDate: item.workoutDate,
								filterId: item.filter?._id,
							});
							setMenuPosition(position);
							setMenuVisible(true);
						}}
					/>
				)}
			/>
			<TrainingActions
				menuPosition={menuPosition}
				menuVisible={menuVisible}
				onClose={closeMenu}
				workout={selectedWorkout}
			/>
		</View>
	);
}
