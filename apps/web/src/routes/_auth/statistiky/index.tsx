import { createFileRoute } from "@tanstack/react-router";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs.tsx";
import Header from "@/components/Header";
import OverallStats from "@/components/statistiky/stats/OverallStats";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Card } from "@/components/ui/card";
import MuscleGroupStats from "@/components/statistiky/muscleGroup/MuscleGroupStats";

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
	const { data: trainings } = useSuspenseQuery(
		convexQuery(api.workouts.getUserWorkouts, {}),
	);

	if (trainings === undefined || trainings?.length === 0)
		return (
			<>
				<Header page="STATISTIKY" />
				<div className="max-w-[500px] mx-auto w-[90%]">
					<Card className="p-4 text-center">
						<p>Pro zobrazení statistik musíte nejprve vytvořit trénink</p>
					</Card>
				</div>
			</>
		);

	return (
		<>
			<Header page="STATISTIKY" />

			<Tabs
				defaultValue="stats"
				className="max-w-[500px] mx-auto w-[90%] space-y-3"
			>
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
				{/*<TabsContent value="history">
          <HistorySets trainings={trainings} />
        </TabsContent>*/}
			</Tabs>
		</>
	);
}
