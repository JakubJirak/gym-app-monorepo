import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { COLORS } from "@/constants/COLORS";
import { toLocalISODateString } from "@/src/utils/date-utils";
import { api } from "../../../../packages/convex/convex/_generated/api";

type Day = {
	dateString: string;
	day: number;
	month: number;
	year: number;
	timestamp: number;
};

LocaleConfig.locales.cz = {
	monthNames: [
		"Leden",
		"Únor",
		"Březen",
		"Duben",
		"Květen",
		"Červen",
		"Červenec",
		"Srpen",
		"Září",
		"Říjen",
		"Listopad",
		"Prosinec",
	],
	monthNamesShort: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"],
	dayNames: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
	dayNamesShort: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
	today: "Dnes",
};
LocaleConfig.defaultLocale = "cz";

type StatsCalendarProps = {
	setCurrentDate?: Dispatch<SetStateAction<string>>;
};

export default function StatsCalendar({ setCurrentDate }: StatsCalendarProps) {
	const TODAY = toLocalISODateString(new Date());
	const [selected, setSelected] = useState(TODAY);
	const trainings = useQuery(api.workouts.getUserWorkouts);

	const trainingDates = trainings?.flatMap((workout) => workout.workoutDate);

	const onDayPress = (day: Day) => {
		setSelected(day.dateString);
		if (setCurrentDate) {
			setCurrentDate(day.dateString);
		}
	};

	return (
		<View>
			{(() => {
				const markedDates: Record<string, object> = {};
				const accentLowOpacity = `${COLORS.accent}99`;
				for (const date of trainingDates ?? []) {
					if (!date) {
						continue;
					}
					markedDates[date] = {
						customStyles: {
							container: {
								backgroundColor: date === selected ? COLORS.accent : accentLowOpacity,
								borderRadius: 8,
								justifyContent: "center",
								alignItems: "center",
								margin: 0,
								padding: 0,
							},
							text: {
								color: "white",
								fontWeight: date === selected ? "bold" : "normal",
								textAlign: "center",
								textAlignVertical: "center",
							},
						},
					};
				}
				// Always mark the selected date, even if not a training date
				if (!markedDates[selected]) {
					markedDates[selected] = {
						customStyles: {
							container: {
								backgroundColor: COLORS.accent,
								borderRadius: 8,
								justifyContent: "center",
								alignItems: "center",
								margin: 0,
								padding: 0,
							},
							text: {
								color: "white",
								fontWeight: "bold",
								textAlign: "center",
								textAlignVertical: "center",
							},
						},
					};
				}
				return (
					<Calendar
						current={selected}
						// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: does its work
						dayComponent={({ date, state }) => {
							if (!date) {
								return null;
							}
							const isSelected = date.dateString === selected;
							const isMarked = Boolean(markedDates[date.dateString]);
							const isTraining = trainingDates?.includes(date.dateString);
							const isToday = date.dateString === TODAY;
							let backgroundColor = COLORS.darker;
							if (isSelected) {
								backgroundColor = COLORS.accent;
							} else if (isTraining) {
								backgroundColor = `${COLORS.accent}99`;
							}
							let color = "white";
							if (isSelected || isMarked) {
								color = "white";
							} else if (isToday) {
								color = COLORS.accent;
							} else if (state === "disabled") {
								color = "#888";
							}
							return (
								<Pressable
									onPress={() => {
										if (state !== "disabled") {
											onDayPress({
												dateString: date.dateString,
												day: date.day,
												month: date.month,
												year: date.year,
												timestamp: date.timestamp,
											});
										}
									}}
									style={{
										backgroundColor,
										borderRadius: 8,
										justifyContent: "center",
										alignItems: "center",
										padding: 0,
										height: 32,
										width: 32,
									}}
								>
									<Text
										style={{
											color,
											fontWeight: isSelected ? "bold" : "normal",
											textAlign: "center",
											textAlignVertical: "center",
											fontSize: 14,
										}}
									>
										{date.day}
									</Text>
								</Pressable>
							);
						}}
						enableSwipeMonths
						firstDay={1}
						markedDates={markedDates}
						markingType={"custom"}
						onDayPress={onDayPress}
						renderArrow={(direction) =>
							direction === "left" ? (
								<ChevronLeft color={COLORS.accent} size={24} />
							) : (
								<ChevronRight color={COLORS.accent} size={24} />
							)
						}
						style={{
							backgroundColor: COLORS.darker,
							borderRadius: 8,
							paddingHorizontal: 0,
							paddingVertical: 0,
							margin: 0,
						}}
						theme={{
							backgroundColor: COLORS.darker,
							calendarBackground: COLORS.darker,
							textSectionTitleColor: "white",
							textSectionTitleDisabledColor: "#888",
							selectedDayBackgroundColor: COLORS.accent,
							selectedDayTextColor: "white",
							dayTextColor: "white",
							textDisabledColor: "#888",
							monthTextColor: "white",
							arrowColor: COLORS.accent,
							todayTextColor: COLORS.accent,
							textDayFontSize: 14,
							textDayHeaderFontSize: 12,
							textMonthFontSize: 16,
						}}
					/>
				);
			})()}
		</View>
	);
}
