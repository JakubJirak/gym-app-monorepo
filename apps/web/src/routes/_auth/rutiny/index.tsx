import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { LuClipboardList } from "react-icons/lu";
import Header from "@/components/Header";
import AddRoutineDialog, { type Routine } from "@/components/rutiny/AddRoutineDialog";
import RoutineLi from "@/components/rutiny/RoutineLi";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/rutiny/")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Rutiny | GYM APPLICATION" }, { name: "description", content: "Rutiny uživatele." }],
	}),
});

function RouteComponent() {
	const { data: rutiny } = useSuspenseQuery(convexQuery(api.routines.getUserRoutines, {}));

	function handleSaveRoutine(routine: Routine) {
		handleAddRoutine(routine);
	}

	const createRoutine = useMutation(api.routines.addRoutine);

	const handleAddRoutine = async (routine: Routine) => {
		await createRoutine({
			name: routine.name,
			filterId: routine.filterId,
		});
	};

	return (
		<>
			<Header page="RUTINY" />
			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<div className="pb-4">
					<div className="-mb-2 flex flex-row items-center gap-1">
						<div className="flex-1 space-y-1">
							<h2 className="flex items-center gap-2 font-bold">
								<LuClipboardList size={20} />
								Vaše rutiny
							</h2>
							<p className="text-muted-foreground text-sm">Celkem rutin: {rutiny.length}</p>
						</div>
						<AddRoutineDialog onSave={handleSaveRoutine} />
					</div>
				</div>

				<div className="space-y-2">
					{rutiny.map((rutina, index) => (
						<div key={rutina._id}>
							<RoutineLi rutina={rutina} />
							{index < rutiny.length - 1 && <Separator className="my-2" />}
						</div>
					))}
				</div>
			</div>
		</>
	);
}
