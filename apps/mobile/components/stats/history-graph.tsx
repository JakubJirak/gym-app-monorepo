import { ScrollView, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { COLORS } from "@/constants/COLORS";

type HistoryPoint = {
	date: string;
	value: number;
	reps: number;
};

type HistoryGraphProps = {
	historyPoints: HistoryPoint[];
};

export default function HistoryGraph({ historyPoints }: HistoryGraphProps) {
	const chartData = historyPoints.map((point) => ({
		value: point.value,
		label: new Date(point.date).toLocaleDateString("cs", {
			day: "numeric",
			month: "short",
		}),
		dataPointText: `${point.value}kg`,
		reps: point.reps,
	}));

	if (chartData.length === 0) {
		return null;
	}

	const maxValue = Math.max(...chartData.map((d) => d.value));
	const minValue = Math.min(...chartData.map((d) => d.value));
	const yAxisRange = maxValue - minValue;
	const yAxisPadding = yAxisRange * 0.2;

	return (
		<View className="mx-4 rounded-xl bg-secondary">
			<ScrollView className="pt-6 pb-4" horizontal showsHorizontalScrollIndicator={false}>
				<LineChart
					areaChart
					color={COLORS.accent}
					curved
					data={chartData}
					dataPointsColor={COLORS.accent}
					dataPointsRadius={3.5}
					endFillColor={COLORS.secondary}
					endOpacity={0.2}
					height={200}
					hideDataPoints={false}
					hideYAxisText
					initialSpacing={10}
					maxValue={maxValue + yAxisPadding}
					noOfSections={3}
					rulesColor={COLORS.inactive}
					rulesType="solid"
					spacing={35}
					startFillColor={COLORS.accent}
					startOpacity={0.4}
					textColor="#ffffff"
					textFontSize={10}
					textShiftX={-4}
					textShiftY={0}
					thickness={2}
					verticalLinesColor={COLORS.inactive}
					width={Math.max(chartData.length * 60, 300)}
					xAxisColor={COLORS.inactive}
					xAxisLabelTextStyle={{ color: COLORS.muted, fontSize: 11 }}
					yAxisColor="transparent"
				/>
			</ScrollView>
		</View>
	);
}
