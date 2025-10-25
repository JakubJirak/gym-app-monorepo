import Header from "@/components/Header.tsx";
import TrainingInfo from "@/components/treninky/trenink/TrainingInfo.tsx";
import TrainingStats from "@/components/treninky/trenink/TrainingStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import MuscleGroupTrainingStats from "@/components/treninky/trenink/MuscleGroupTrainingStats";

export const Route = createFileRoute("/_auth/treninky/$trainingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { trainingId } = Route.useParams();
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		}),
	);

	if (!training) return null;

	return (
		<div className="pb-8">
			<Header page={training.name} />

			<Tabs
				defaultValue="cviky"
				className="max-w-[500px] mx-auto w-[90%] space-y-3"
			>
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
