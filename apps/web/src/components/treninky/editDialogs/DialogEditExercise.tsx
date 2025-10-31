import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { ExerciseSelect } from "utils/training-types";
import { ExerciseCombobox } from "@/components/treninky/ExerciseCombobox.tsx";
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
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

interface DialogEditSet {
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DialogEditExercise({ exerciseId, setOpenParent }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [selectedStatusesEx, setSelectedStatusesEx] = useState<ExerciseSelect | null>(null);
	const editExercise = useMutation(api.workoutExercises.editExercise);

	function handleEditExercise(id: string) {
		editExercise({
			workoutExerciseId: id as Id<"workoutExercises">,
			exerciseId: selectedStatusesEx?._id as Id<"exercises">,
		});
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (selectedStatusesEx) {
			handleEditExercise(exerciseId);
			setOpen(false);
		}
		setSelectedStatusesEx(null);
		setOpenParent(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button className="w-40" variant="outline">
						<Pencil className="size-4" />
						Změnit cvik
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Změna cviku</DialogTitle>
						<DialogDescription>Zde můžete změnit typ cviku v tréninku.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<ExerciseCombobox
							exerciseId="a"
							selectedStatus={selectedStatusesEx}
							setSelectedStatus={setSelectedStatusesEx}
						/>
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
