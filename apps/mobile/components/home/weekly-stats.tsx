import { useRouter } from "expo-router";
import { Calendar, Repeat, TrendingUp, Weight } from "lucide-react-native";
import { useMemo } from "react";
import { type GestureResponderEvent, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type WeeklyStatsProps = {
	trainings: typeof api.workouts.getUserWorkouts._returnType;
};

export default function WeeklyStats({ trainings }: WeeklyStatsProps) {
	const router = useRouter();
	const today = new Date();
	const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
	const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate offset to Monday

	// Get training dates
	const trainingDates = trainings?.flatMap((workout) => workout.workoutDate) ?? [];

	// Generate array of 7 days starting from Monday
	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(today);
		date.setDate(today.getDate() + mondayOffset + i);
		return {
			date,
			dateString: toLocalISODateString(date),
			dayName: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"][date.getDay()],
			dayNumber: date.getDate(),
		};
	});

	// Get week date strings for filtering
	const weekDateStrings = weekDays.map((day) => day.dateString);

	// Filter trainings to only this week
	const weekTrainings = useMemo(
		() => trainings?.filter((training) => weekDateStrings.includes(training.workoutDate ?? "")) ?? [],
		[trainings, weekDateStrings]
	);

	// Calculate stats for this week only
	const totalWorkouts = weekTrainings.length;

	const allSets = useMemo(
		() =>
			weekTrainings.reduce(
				(acc, training) =>
					acc + training.exercises.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0),
				0
			),
		[weekTrainings]
	);

	const allWeight = useMemo(
		() =>
			weekTrainings.reduce(
				(acc, training) =>
					acc +
					training.exercises.reduce(
						(exAcc, exercise) =>
							exAcc +
							exercise.sets.reduce(
								(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
								0
							),
						0
					),
				0
			),
		[weekTrainings]
	);

	const allReps = useMemo(
		() =>
			weekTrainings.reduce(
				(acc, training) =>
					acc +
					training.exercises.reduce(
						(exAcc, exercise) =>
							exAcc +
							exercise.sets.reduce((setAcc, set) => setAcc + Number(set.reps ?? 0), 0),
						0
					),
				0
			),
		[weekTrainings]
	);

	const totalWeight = (Number(allWeight) / 1000).toFixed(1);

	// Show empty state if no trainings this week
	if (totalWorkouts === 0) {
		return (
			<View className="w-full gap-3">
				<View className="mb-1 flex-row items-center gap-2">
					<Calendar color={COLORS.accent} size={20} />
					<Text className="font-semibold text-text text-xl">Tento týden</Text>
				</View>
				<View className="rounded-xl bg-secondary px-4 py-6">
					<Text className="text-center text-muted">Tento týden nemáte zapsaný žádný trénink</Text>
				</View>
			</View>
		);
	}

	const handleCalendarPress = () => {
		router.push("/(auth)/(tabs)/stats/calendar");
	};

	return (
		<View className="w-full gap-3">
			<View className="mb-1 flex-row items-center gap-2">
				<Calendar color={COLORS.accent} size={20} />
				<Text className="font-semibold text-text text-xl">Tento týden</Text>
			</View>
			<TouchableOpacity
				activeOpacity={0.8}
				className="rounded-xl bg-secondary px-3 py-3"
				onPress={handleCalendarPress}
			>
				<View className="flex-row justify-between gap-3">
					{weekDays.map((day) => {
						const hasTraining = trainingDates.includes(day.dateString);
						const isToday = day.dateString === toLocalISODateString(today);
						const dayTraining = weekTrainings.find((t) => t.workoutDate === day.dateString);

						const backgroundColor = hasTraining ? `${COLORS.accent}99` : COLORS.darker;

						let textColor = COLORS.muted;
						if (hasTraining) {
							textColor = "white";
						} else if (isToday) {
							textColor = COLORS.accent;
						}

						const handleDayPress = (e: GestureResponderEvent) => {
							if (dayTraining) {
								e.stopPropagation();
								router.push({
									pathname: "/training/[id]",
									params: { id: dayTraining._id },
								});
							}
						};

						return (
							<View className="flex-1 items-center gap-1" key={day.dateString}>
								<Text className="text-muted text-xs">{day.dayName}</Text>
								<TouchableOpacity
									activeOpacity={hasTraining ? 0.7 : 1}
									className="h-10 w-10 items-center justify-center rounded-lg"
									disabled={!hasTraining}
									onPress={handleDayPress}
									style={{
										backgroundColor,
									}}
								>
									<Text
										className="text-sm"
										style={{
											color: textColor,
											fontWeight: hasTraining ? "bold" : "normal",
										}}
									>
										{day.dayNumber}
									</Text>
								</TouchableOpacity>
							</View>
						);
					})}
				</View>
			</TouchableOpacity>

			<View className="rounded-xl bg-secondary px-3 py-2">
				<View className="flex-row justify-between gap-4">
					<TouchableOpacity
						activeOpacity={0.7}
						className="flex-1 items-center gap-0.5 rounded-lg bg-darker py-2.5"
						onPress={() => router.push("/(auth)/(tabs)/trainings")}
					>
						<Calendar color={COLORS.muted} size={18} />
						<Text className="mt-1 font-bold text-text">{totalWorkouts}</Text>
					</TouchableOpacity>
					<View className="flex-1 items-center gap-0.5 rounded-lg bg-darker py-2.5">
						<TrendingUp color={COLORS.muted} size={18} />
						<Text className="mt-1 font-bold text-text">{allSets}</Text>
					</View>
					<View className="flex-1 items-center gap-0.5 rounded-lg bg-darker py-2.5">
						<Weight color={COLORS.muted} size={18} />
						<Text className="mt-1 font-bold text-text">{totalWeight}t</Text>
					</View>
					<View className="flex-1 items-center gap-0.5 rounded-lg bg-darker py-2.5">
						<Repeat color={COLORS.muted} size={18} />
						<Text className="mt-1 font-bold text-text">{allReps}</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
