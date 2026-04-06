import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	BicepsFlexed,
	ChartColumnIncreasing,
	Dumbbell,
	NotebookPen,
	Repeat,
	Share2,
	TrendingUp,
	Weight,
} from "lucide-react";
import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { formatDate } from "utils/date-utils";
import { formatSetInfo } from "utils/training-format";
import { Badge } from "@/components/ui/badge";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "../../../../../packages/convex/convex/_generated/api";

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

export const Route = createFileRoute("/shared/$trainingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { trainingId } = Route.useParams();
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getSharedWorkoutById, {
			workoutId: trainingId,
		})
	);

	const totalWeight = useMemo(
		() =>
			training?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc +
					exercise.sets.reduce(
						(setAcc, set) => setAcc + Number(set.weight ?? 0) * (set.reps ?? 0),
						0
					),
				0
			) ?? 0,
		[training?.exercises]
	);

	const allReps = useMemo(
		() =>
			training?.exercises?.reduce(
				(exAcc, exercise) =>
					exAcc + exercise.sets.reduce((setAcc, set) => setAcc + Number(set.reps ?? 0), 0),
				0
			) ?? 0,
		[training?.exercises]
	);

	const allSets = useMemo(
		() => training?.exercises?.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0) ?? 0,
		[training?.exercises]
	);

	const allExercises = training?.exercises?.length ?? 0;

	const muscleGroupCounts = useMemo(
		() =>
			training?.exercises?.reduce((acc: Record<string, number>, exercise) => {
				const muscleGroup = exercise.exercise?.muscleGroup ?? "";
				if (muscleGroup) {
					acc[muscleGroup] = (acc[muscleGroup] || 0) + 1;
				}
				return acc;
			}, {}) ?? {},
		[training?.exercises]
	);

	const muscleGroupStats = Object.entries(muscleGroupCounts).map(([muscleGroup, number], index) => ({
		muscleGroup,
		number,
		fill: COLORS[index % COLORS.length],
	}));

	if (!training) {
		return (
			<div className="mx-auto w-[90%] max-w-125 py-10 text-center text-muted-foreground">
				Trénink nebyl nalezen nebo není sdílený.
			</div>
		);
	}

	return (
		<div className="pb-8">
			<header className="mx-auto mb-6 max-w-125 rounded-b-xl bg-white px-4 py-3 text-center">
				<p className="font-bold text-black text-xl">
					{formatDate(new Date(training.workoutDate), "dd.MM.yyyy")}
				</p>
			</header>

			<Tabs className="mx-auto w-[90%] max-w-125 space-y-3" defaultValue="cviky">
				<TabsList className="w-full bg-secondary">
					<TabsTrigger value="cviky">Cviky</TabsTrigger>
					<TabsTrigger value="statistiky">Statistiky</TabsTrigger>
				</TabsList>

				<TabsContent value="cviky">
					<div>
						<p className="mt-1 text-sm">Autor: {training.authorName ?? "Neznámý"}</p>
						<div className="mb-2 flex w-full items-center justify-between">
							{training.name !== "" && (
								<div className="col-span-2 flex items-center gap-2 text-muted-foreground text-sm">
									<NotebookPen size={16} />
									{training.name}
								</div>
							)}
							<div
								className="mr-2 ml-auto rounded-xl border px-2 py-1 text-center text-xs"
								style={{
									borderColor: training.filter?.color
										? `${training.filter.color}99`
										: "hsl(var(--border))",
									color: training.filter?.color || "hsl(var(--foreground))",
								}}
							>
								{training.filter?.name || "Žádný"}
							</div>
							<Badge variant="secondary">Cviky: {training.exercises.length}</Badge>
							<div className="ml-2 rounded-md bg-secondary p-1.25">
								<Share2 className="size-4" />
							</div>
						</div>

						<div className="relative flex flex-col items-stretch">
							{training.exercises.map((exercise, index) => (
								<div className="mt-2 space-y-3 rounded-lg" key={exercise._id}>
									<div className="flex items-center justify-between">
										<h4 className="font-semibold text-lg">
											{exercise.exercise?.name}
										</h4>
										<Badge variant="outline">
											{exercise.exercise?.muscleGroup}
										</Badge>
									</div>

									<div className="grid gap-2">
										{exercise.sets.map((set, setIndex) => (
											<div
												className="flex items-center rounded-md bg-secondary px-3 py-2"
												key={set._id}
											>
												<span className="flex-1 text-sm">
													{setIndex + 1}. série
												</span>
												<span className="mr-2 font-medium text-sm">
													{formatSetInfo(set)}
												</span>
											</div>
										))}
									</div>

									{exercise.note && (
										<p className="text-muted-foreground text-sm">
											{exercise.note}
										</p>
									)}

									{index !== training.exercises.length - 1 && <Separator />}
								</div>
							))}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="statistiky">
					<div className="space-y-8">
						<div>
							<p className="mb-4 flex items-center gap-3 font-bold text-lg">
								<ChartColumnIncreasing />
								Celkové statistiky
							</p>
							<div className="gird-rows-2 grid grid-cols-2 gap-5">
								<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
									<Dumbbell />
									<p className="mt-1 font-bold text-2xl">{allExercises}</p>
									<p className="text-muted-foreground">Cviky</p>
								</div>
								<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
									<TrendingUp />
									<p className="mt-1 font-bold text-2xl">{allSets}</p>
									<p className="text-muted-foreground">Série</p>
								</div>
								<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
									<Repeat />
									<p className="mt-1 font-bold text-2xl">{allReps}</p>
									<p className="text-muted-foreground">Opakovaní</p>
								</div>
								<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
									<Weight />
									<p className="mt-1 font-bold text-2xl">{totalWeight}kg</p>
									<p className="text-muted-foreground">Váha</p>
								</div>
							</div>
						</div>

						<div>
							<p className="mb-4 flex items-center gap-3 font-bold text-lg">
								<BicepsFlexed />
								Statistiky podle partie
							</p>

							<ChartContainer
								className="mx-auto aspect-square max-h-62.5"
								config={chartConfig}
							>
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
									<Pie
										data={muscleGroupStats}
										dataKey="number"
										nameKey="muscleGroup"
									/>
								</PieChart>
							</ChartContainer>

							<div className="grid grid-cols-2 gap-y-2">
								{muscleGroupStats.map((muscleGroup) => (
									<div
										className="flex items-center gap-1.5"
										key={muscleGroup.muscleGroup}
									>
										<div
											className="size-4 rounded-sm"
											style={{ backgroundColor: muscleGroup.fill }}
										/>
										<p>{muscleGroup.muscleGroup}</p>
										<p>{muscleGroup.number}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
