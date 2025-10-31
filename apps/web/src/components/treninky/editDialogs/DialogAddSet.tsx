import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
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
	order: number;
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DialogAddSet({ order, exerciseId, setOpenParent }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [addSetWeight, setAddSetWeight] = useState<string>("");
	const [addSetReps, setAddSetReps] = useState<string>("");
	const addSet = useMutation(api.workoutExercises.addSet);

	function handleAddSet(exerciseId: string, order: number, addSetWeight: string, addSetReps: string) {
		addSet({
			workoutExerciseId: exerciseId as Id<"workoutExercises">,
			weight: Number(addSetWeight),
			reps: Number(addSetReps),
			order,
		});
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleAddSet(exerciseId, order, addSetWeight, addSetReps);
		setOpen(false);
		setAddSetWeight("");
		setAddSetReps("");
		setOpenParent(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button className="w-40" variant="outline">
						<Plus className="size-5" />
						Přidat sérii
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Přidání série</DialogTitle>
						<DialogDescription>Zde můžete přidat sérii k vybranému cviku.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
							<div className="grid gap-3">
								<Label htmlFor="vaha">Váha (kg)</Label>
								<Input
									id="vaha"
									min={1}
									name="vaha"
									onChange={(e) => setAddSetWeight(e.target.value)}
									required
									step={0.01}
									type="number"
									value={addSetWeight}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="opak">Počet opakování</Label>
								<Input
									id="opak"
									min={1}
									name="opak"
									onChange={(e) => setAddSetReps(e.target.value)}
									required
									step={0.01}
									type="number"
									value={addSetReps}
								/>
							</div>
						</div>

						<DialogFooter className="mt-4">
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
