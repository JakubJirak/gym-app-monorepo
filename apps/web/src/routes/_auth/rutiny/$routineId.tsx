import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
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
	const {
		data: rutina,
		isError,
		isPending,
	} = useQuery(
		convexQuery(api.routines.getRoutineDetail, {
			routineId: routineId as Id<"routines">,
		})
	);

	let content: ReactNode;
	if (isPending) {
		content = (
			<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
				<LoaderCircle className="h-5 w-5 animate-spin" />
				<span>Načítám rutinu…</span>
			</div>
		);
	} else if (isError) {
		content = <p className="py-10 text-center text-muted-foreground">Rutinu se nepodařilo načíst.</p>;
	} else if (!rutina) {
		content = <p className="py-10 text-center text-muted-foreground">Rutina nebyla nalezena.</p>;
	} else if (rutina.exercises.length === 0) {
		content = <p className="py-6 text-center text-muted-foreground text-sm">Žádné cviky v rutině</p>;
	} else {
		content = (
			<div>
				{rutina.exercises.map((exerciseData, index) => (
					<div key={exerciseData._id}>
						<div className="flex items-center justify-between py-3">
							<span className="font-medium">
								{exerciseData.exercise?.name || "Neznámý cvik"}
							</span>
							{exerciseData.exercise?.muscleGroup && (
								<Badge variant="secondary">{exerciseData.exercise.muscleGroup}</Badge>
							)}
						</div>
						{index < rutina.exercises.length - 1 && <Separator />}
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			<Header page={rutina?.name ?? "RUTINA"} />
			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">{content}</div>
		</>
	);
}
