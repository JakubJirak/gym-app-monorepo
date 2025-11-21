import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
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
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type DialogEditNote = {
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DialogEditNote({ exerciseId, setOpenParent }: DialogEditNote) {
	const [open, setOpen] = useState<boolean>(false);
	const [note, setNote] = useState<string>("");
	const editNote = useMutation(api.workoutExercises.editNote);

	function handleEditNote(id: string, noteName: string) {
		editNote({
			workoutExerciseId: id as Id<"workoutExercises">,
			note: noteName,
		});
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleEditNote(exerciseId, note);
		setOpenParent(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button className="w-40" variant="outline">
						<Pencil className="size-4" />
						Upravit pozn.
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Změna poznámky</DialogTitle>
						<DialogDescription>
							Zde můžete změnit poznámku ke cviku, odesláním prázdné poznámky se smaže.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<Input onChange={(e) => setNote(e.target.value)} type="text" value={note} />
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
