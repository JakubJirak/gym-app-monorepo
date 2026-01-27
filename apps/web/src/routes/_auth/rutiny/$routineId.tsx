import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

export const Route = createFileRoute("/_auth/rutiny/$routineId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { routineId } = Route.useParams();
	const { data: rutina } = useSuspenseQuery(
		convexQuery(api.routines.getRoutineById, {
			routineId: routineId as Id<"routines">,
		})
	);

	if (!rutina) {
		return null;
	}

	return (
		<>
			<Header page={rutina.name} />
			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<div className="">
					{rutina.exercises.length === 0 ? (
						<p className="text-muted-foreground text-sm">Žádné cviky v rutině</p>
					) : (
						rutina.exercises.map((exerciseData, index) => (
							<div key={exerciseData._id}>
								<div className="flex items-center justify-between py-3">
									<span className="font-medium">
										{exerciseData.exercise?.name || "Neznámý cvik"}
									</span>
									{exerciseData.exercise?.muscleGroup && (
										<Badge variant="secondary">
											{exerciseData.exercise.muscleGroup}
										</Badge>
									)}
								</div>
								{index < rutina.exercises.length - 1 && <Separator />}
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}
