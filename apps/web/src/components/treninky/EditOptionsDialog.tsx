import { useMutation } from "convex/react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { useState } from "react";
import { DialogAddSet } from "@/components/treninky/editDialogs/DialogAddSet.tsx";
import DialogDeleteExercise from "@/components/treninky/editDialogs/DialogDeleteExercise.tsx";
import { DialogEditExercise } from "@/components/treninky/editDialogs/DialogEditExercise.tsx";
import { DialogEditNote } from "@/components/treninky/editDialogs/DialogEditNote.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type EditOptionsDialogProps = {
	order: number;
	exerciseId: Id<"workoutExercises">;
	workoutId: Id<"workouts">;
	orderSet: number;
	isFirst: boolean;
	isLast: boolean;
};

export function EditOptionsDialog({ orderSet, exerciseId, workoutId, order, isFirst, isLast }: EditOptionsDialogProps) {
	const [openParent, setOpenParent] = useState(false);
	const moveUp = useMutation(api.workoutExercises.moveUp);
	const moveDown = useMutation(api.workoutExercises.moveDown);

	function handleMoveUp() {
		moveUp({
			workoutExerciseId: exerciseId,
			workoutId,
			order,
		});
		setOpenParent(false);
	}

	function handleMoveDown() {
		moveDown({
			workoutExerciseId: exerciseId,
			workoutId,
			order,
		});
		setOpenParent(false);
	}

	return (
		<Dialog onOpenChange={setOpenParent} open={openParent}>
			<DialogTrigger asChild>
				<Button size="icon-xs" variant="outline">
					<Pencil className="size-3" />
				</Button>
			</DialogTrigger>
			<DialogContent className="h-auto sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Změna ve cviku</DialogTitle>
					<DialogDescription>Zde můžete změnit vše v daném cviku.</DialogDescription>

					<div className="mt-4 flex w-full flex-col items-center gap-2">
						<DialogAddSet
							exerciseId={exerciseId}
							order={orderSet}
							setOpenParent={setOpenParent}
						/>

						<DialogEditExercise exerciseId={exerciseId} setOpenParent={setOpenParent} />

						<DialogEditNote exerciseId={exerciseId} setOpenParent={setOpenParent} />

						{!isFirst && (
							<Button className="w-40" onClick={handleMoveUp} variant="outline">
								<ChevronUp className="size-5" />
								Nahoru
							</Button>
						)}

						{!isLast && (
							<Button className="w-40" onClick={handleMoveDown} variant="outline">
								<ChevronDown className="size-5" />
								Dolů
							</Button>
						)}

						<DialogDeleteExercise
							exerciseId={exerciseId}
							order={order}
							setOpenParent={setOpenParent}
							workoutId={workoutId}
						/>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
