import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BicepsFlexed } from "lucide-react";
import { Pie, PieChart } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	Chest: {
		label: "Chest",
		color: "var(--chart-1)",
	},
	Shoulders: {
		label: "Shoulders",
		color: "var(--chart-2)",
	},
	Triceps: {
		label: "Triceps",
		color: "var(--chart-3)",
	},
	Biceps: {
		label: "Biceps",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

const COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
	"var(--chart-6)",
	"var(--chart-7)",
	"var(--chart-8)",
	"var(--chart-9)",
	"var(--chart-10)",
];

const MuscleGroupTrainingStats = ({ trainingId }: { trainingId: string }) => {
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		})
	);

	const muscleGroupCounts =
		training?.exercises?.reduce((acc: Record<string, number>, exercise) => {
			const muscleGroup = exercise.exercise?.muscleGroup ?? "";
			if (muscleGroup) {
				acc[muscleGroup] = (acc[muscleGroup] || 0) + 1;
			}
			return acc;
		}, {}) ?? {};

	const muscleGroupStats = Object.entries(muscleGroupCounts).map(([muscleGroup, number], index) => ({
		muscleGroup,
		number,
		fill: COLORS[index % COLORS.length],
	}));

	return (
		<div>
			<p className="mb-4 flex items-center gap-3 font-bold text-lg">
				<BicepsFlexed />
				Statistiky podle partie
			</p>

			<ChartContainer className="mx-auto aspect-square max-h-[250px]" config={chartConfig}>
				<PieChart>
					<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
					<Pie data={muscleGroupStats} dataKey="number" nameKey="muscleGroup" />
				</PieChart>
			</ChartContainer>

			<div className="grid grid-cols-2 gap-y-2">
				{muscleGroupStats.map((muscleGroup) => (
					<div className="flex items-center gap-1.5" key={muscleGroup.muscleGroup}>
						<div className="size-4 rounded-sm" style={{ backgroundColor: muscleGroup.fill }} />
						<p>{muscleGroup.muscleGroup}</p>
						<p>{muscleGroup.number}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default MuscleGroupTrainingStats;
