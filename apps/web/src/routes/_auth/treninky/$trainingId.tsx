import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDate } from "utils/date-utils";
import Header from "@/components/Header.tsx";
import MuscleGroupTrainingStats from "@/components/treninky/trenink/MuscleGroupTrainingStats";
import TrainingInfo from "@/components/treninky/trenink/TrainingInfo.tsx";
import TrainingStats from "@/components/treninky/trenink/TrainingStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

export const Route = createFileRoute("/_auth/treninky/$trainingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { trainingId } = Route.useParams();
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		})
	);

	if (!training) {
		return null;
	}

	return (
		<div className="pb-8">
			<Header page={formatDate(new Date(training.workoutDate), "dd.MM.yyyy")} />

			<Tabs className="mx-auto w-[90%] max-w-[500px] space-y-3" defaultValue="cviky">
				<TabsList className="w-full bg-secondary">
					<TabsTrigger value="cviky">Cviky</TabsTrigger>
					<TabsTrigger value="statistiky">Statistiky</TabsTrigger>
				</TabsList>
				<TabsContent value="cviky">
					<TrainingInfo trainingId={trainingId} />
				</TabsContent>
				<TabsContent value="statistiky">
					<div className="space-y-8">
						<TrainingStats trainingId={trainingId} />
						<MuscleGroupTrainingStats trainingId={trainingId} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
