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
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { ExerciseSelect } from "utils/training-types";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

interface DialogEditSet {
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DialogEditExercise({
	exerciseId,
	setOpenParent,
}: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [selectedStatusesEx, setSelectedStatusesEx] =
		useState<ExerciseSelect | null>(null);
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
		<Dialog open={open} onOpenChange={setOpen}>
			<form>
				<DialogTrigger asChild>
					<Button variant="outline" className="w-40">
						<Pencil className="size-4" />
						Změnit cvik
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] h-auto">
					<DialogHeader>
						<DialogTitle>Změna cviku</DialogTitle>
						<DialogDescription>
							Zde můžete změnit typ cviku v tréninku.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<ExerciseCombobox
							selectedStatus={selectedStatusesEx}
							setSelectedStatus={setSelectedStatusesEx}
							exerciseId="a"
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
