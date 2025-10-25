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
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { ExerciseSelect } from "utils/training-types";

interface DialogEditSet {
	trainingId: string;
	order: number;
}

export function DialogAddExercise({ trainingId, order }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [selectedStatuses, setSelectedStatuses] =
		useState<ExerciseSelect | null>(null);
	const addWorkoutExercise = useMutation(
		api.workoutExercises.addWorkoutExercise,
	);

	function handleAddExercise(trainingId: string, order: number) {
		addWorkoutExercise({
			workoutId: trainingId as Id<"workouts">,
			exerciseId: selectedStatuses?._id as Id<"exercises">,
			order: order,
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
		<Dialog open={open} onOpenChange={setOpen}>
			<form>
				<DialogTrigger asChild>
					<Button variant="outline">
						<Plus className="h-3 w-3" />
						Přidat cvik
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] h-auto">
					<DialogHeader>
						<DialogTitle>Přidání cviku</DialogTitle>
						<DialogDescription>
							Zde můžete přidat nový cvik do tréninku.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<ExerciseCombobox
							selectedStatus={selectedStatuses}
							setSelectedStatus={setSelectedStatuses}
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
