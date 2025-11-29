import { ScrollView, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { COLORS } from "@/constants/COLORS";

type HistorySet = {
	id: string;
	name: string;
	date: string;
	sets: {
		_id: string;
		reps: number;
		weight: number;
		order: number;
	}[];
};

type HistoryGraphProps = {
	historySets: HistorySet[];
};

export default function HistoryGraph({ historySets }: HistoryGraphProps) {
	const sortedHistorySets = [...historySets]
		.filter(Boolean)
		.sort((a, b) => new Date(a?.date ?? "2025-01-01").getTime() - new Date(b?.date ?? "2025-01-01").getTime());

	const chartData = sortedHistorySets
		.map((set) => {
			if (!set) {
				return null;
			}

			const weights = set.sets.map((s) => Number(s.weight)).filter((w) => !Number.isNaN(w));

			const maxWeight = weights.length > 0 ? Math.max(...weights) : null;
			if (maxWeight === null) {
				return null;
			}

			const maxWeightSets = set.sets.filter((s) => Number(s.weight) === maxWeight);

			const maxReps =
				maxWeightSets.length > 0
					? Math.max(...maxWeightSets.map((s) => Number(s.reps)).filter((r) => !Number.isNaN(r)))
					: null;

			return {
				value: maxWeight,
				label: new Date(set.date).toLocaleDateString("cs", {
					day: "numeric",
					month: "short",
				}),
				dataPointText: `${maxWeight}kg`,
				reps: maxReps,
			};
		})
		.filter((item): item is NonNullable<typeof item> => item !== null);

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
					animationDuration={400}
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
					isAnimated
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
