import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { CustomTooltip } from "@/components/statistiky/history/CustomTooltip.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart.tsx";
import type { api } from "../../../../../../packages/convex/convex/_generated/api";

type ChartFirstSetsProps = {
	chartData: typeof api.stats.getExerciseHistory._returnType.chart;
};

const ChartFirstSets = ({ chartData }: ChartFirstSetsProps) => {
	const chartConfig = {
		weight: {
			label: "Vaha",
			color: "#2563eb",
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardContent>
				<ChartContainer className="min-h-50 w-full" config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 40,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							axisLine={false}
							dataKey="date"
							tickFormatter={(value) => {
								const date = new Date(value);
								const len = date.toLocaleDateString().length;
								return date.toLocaleDateString().slice(0, len - 4);
							}}
							tickLine={false}
							tickMargin={10}
						/>
						<ChartTooltip content={(props) => <CustomTooltip {...props} />} />
						<Bar dataKey="value" fill="#2563eb" radius={4}>
							<LabelList
								className="fill-foreground"
								fontSize={12}
								offset={12}
								position="top"
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default ChartFirstSets;
