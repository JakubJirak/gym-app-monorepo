import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
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
	trainingId: string;
	order: number;
}

export function DialogAddExercise({ trainingId, order }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [selectedStatuses, setSelectedStatuses] = useState<ExerciseSelect | null>(null);
	const addWorkoutExercise = useMutation(api.workoutExercises.addWorkoutExercise);

	function handleAddExercise(trainingId: string, order: number) {
		addWorkoutExercise({
			workoutId: trainingId as Id<"workouts">,
			exerciseId: selectedStatuses?._id as Id<"exercises">,
			order,
		});
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (selectedStatuses) {
			handleAddExercise(trainingId, order);
			setOpen(false);
		}
		setSelectedStatuses(null);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button variant="outline">
						<Plus className="h-3 w-3" />
						Přidat cvik
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Přidání cviku</DialogTitle>
						<DialogDescription>Zde můžete přidat nový cvik do tréninku.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<ExerciseCombobox
							exerciseId="a"
							selectedStatus={selectedStatuses}
							setSelectedStatus={setSelectedStatuses}
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
