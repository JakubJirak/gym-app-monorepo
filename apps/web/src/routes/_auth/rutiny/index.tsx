import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
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
	const { data: rutiny, isError, isPending } = useQuery(convexQuery(api.routines.getUserRoutineSummaries, {}));

	const createRoutine = useMutation(api.routines.addRoutine);

	const handleSaveRoutine = async (routine: Routine) => {
		await createRoutine({
			name: routine.name,
			filterId: routine.filterId,
		});
	};

	let content: ReactNode;
	if (isPending) {
		content = (
			<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
				<LoaderCircle className="h-5 w-5 animate-spin" />
				<span>Načítám rutiny…</span>
			</div>
		);
	} else if (isError || !rutiny) {
		content = <p className="py-10 text-center text-muted-foreground">Rutiny se nepodařilo načíst.</p>;
	} else {
		content = (
			<>
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
					{rutiny.length > 0 ? (
						rutiny.map((rutina, index) => (
							<div key={rutina._id}>
								<RoutineLi rutina={rutina} />
								{index < rutiny.length - 1 && <Separator className="my-2" />}
							</div>
						))
					) : (
						<p className="py-6 text-center text-muted-foreground text-sm">
							Zatím nemáte žádnou rutinu.
						</p>
					)}
				</div>
			</>
		);
	}

	return (
		<>
			<Header page="RUTINY" />
			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">{content}</div>
		</>
	);
}
