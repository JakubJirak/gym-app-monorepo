import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

interface DialogEditSet {
	repsBefore: string | null;
	weightBefore: string | null;
	setId: string;
}

export function DialogEditSet({ repsBefore, weightBefore, setId }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [editReps, setEditReps] = useState<string>(repsBefore ? String(repsBefore) : "");
	const [editWeight, setEditWeight] = useState<string>(weightBefore ? weightBefore : "");

	const deleteSet = useMutation(api.workoutExercises.deleteSet);
	const editSet = useMutation(api.workoutExercises.editSet);

	function handleDeleteSet(id: string) {
		deleteSet({ setId: id as Id<"sets"> });
	}

	function handleEditSet(id: string, editSetWeight: string, editSetReps: string) {
		editSet({
			setId: id as Id<"sets">,
			weight: Number(editSetWeight),
			reps: Number(editSetReps),
		});
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleEditSet(setId, editWeight, editReps);
		setOpen(false);
	};

	if (!(repsBefore && weightBefore)) return null;

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button size="icon-xs" variant="outline">
						<Pencil className="size-3" />
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Změna série</DialogTitle>
						<DialogDescription>
							Zde můžete změnit váhu nebo počet opakování v sérii.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
							<div className="grid gap-3">
								<Label htmlFor="vaha">Váha (kg)</Label>
								<Input
									id="vaha"
									min={1}
									name="vaha"
									onChange={(e) => setEditWeight(e.target.value)}
									required
									step={0.01}
									type="number"
									value={editWeight}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="opak">Počet opakování</Label>
								<Input
									id="opak"
									min={1}
									name="opak"
									onChange={(e) => setEditReps(e.target.value)}
									placeholder={String(repsBefore)}
									required
									step={0.01}
									type="number"
									value={editReps}
								/>
							</div>
						</div>

						<DialogFooter className="mt-4">
							<Button
								className="mr-auto"
								onClick={() => handleDeleteSet(setId)}
								type="button"
								variant="destructive"
							>
								<FaRegTrashCan />
								Odstranit sérii
							</Button>
							<DialogClose asChild>
								<Button variant="outline">Zrušit</Button>
							</DialogClose>
							<Button type="submit">Uložit změny</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</form>
		</Dialog>
	);
}
