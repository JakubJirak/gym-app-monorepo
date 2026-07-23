import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import Header from "@/components/Header";
import HistorySets from "@/components/statistiky/history/HistorySets";
import MuscleGroupStats from "@/components/statistiky/muscleGroup/MuscleGroupStats";
import OverallStats from "@/components/statistiky/stats/OverallStats";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/statistiky/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Statistiky | GYM APPLICATION" },
			{ name: "description", content: "Seznam všech statistik uživatele" },
		],
	}),
});

function RouteComponent() {
	const { data: stats, isPending } = useQuery(convexQuery(api.stats.getOverallStats, {}));

	if (isPending) {
		return (
			<>
				<Header page="STATISTIKY" />
				<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
					<LoaderCircle className="h-5 w-5 animate-spin" />
					<span>Načítám statistiky…</span>
				</div>
			</>
		);
	}

	if (!stats || stats.workoutCount === 0) {
		return (
			<>
				<Header page="STATISTIKY" />
				<div className="mx-auto w-[90%] max-w-125">
					<Card className="p-4 text-center">
						<p>Pro zobrazení statistik musíte nejprve vytvořit trénink</p>
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			<Header page="STATISTIKY" />

			<Tabs className="mx-auto w-[90%] max-w-125 space-y-3" defaultValue="stats">
				<TabsList className="w-full bg-secondary">
					<TabsTrigger value="stats">Celkově</TabsTrigger>
					<TabsTrigger value="musclegroup">Podle partie</TabsTrigger>
					<TabsTrigger value="history">Historie</TabsTrigger>
				</TabsList>
				<TabsContent value="stats">
					<OverallStats stats={stats} />
				</TabsContent>
				<TabsContent value="musclegroup">
					<MuscleGroupStats />
				</TabsContent>
				<TabsContent value="history">
					<HistorySets />
				</TabsContent>
			</Tabs>
		</>
	);
}
