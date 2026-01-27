import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
	const { data: trainings } = useSuspenseQuery(convexQuery(api.workouts.getUserWorkouts, {}));

	if (trainings === undefined || trainings?.length === 0) {
		return (
			<>
				<Header page="STATISTIKY" />
				<div className="mx-auto w-[90%] max-w-[500px]">
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

			<Tabs className="mx-auto w-[90%] max-w-[500px] space-y-3" defaultValue="stats">
				<TabsList className="w-full bg-secondary">
					<TabsTrigger value="stats">Celkově</TabsTrigger>
					<TabsTrigger value="musclegroup">Podle partie</TabsTrigger>
					<TabsTrigger value="history">Historie</TabsTrigger>
				</TabsList>
				<TabsContent value="stats">
					<OverallStats />
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
