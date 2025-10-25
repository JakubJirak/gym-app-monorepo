import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMutation } from "convex/react";
import type React from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

interface DialogDeleteTraining {
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogDeleteTraining = ({
	exerciseId,
	setOpenParent,
}: DialogDeleteTraining) => {
	const deleteWorkoutExercise = useMutation(
		api.workoutExercises.deleteWorkoutExercise,
	);

	function handleDeleteExercise(id: string) {
		deleteWorkoutExercise({
			workoutExerciseId: id as Id<"workoutExercises">,
		});
	}

	return (
		<AlertDialog>
			{/*@ts-ignore*/}
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="mx-auto w-40">
					<FaRegTrashCan className="size-3" />
					Odstranit cvik
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Jste si opravdu jistí?</AlertDialogTitle>
					<AlertDialogDescription>
						Tato akce se nedá navrátit. Navždy smaže váš cvik se všemi sériemi a
						poznámkami.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Zrušit</AlertDialogCancel>
					{/*@ts-ignore*/}
					<AlertDialogAction
						asChild
						onClick={() => {
							handleDeleteExercise(exerciseId);
							setOpenParent(false);
						}}
					>
						<Button className="text-foreground" variant="destructive">
							Smazat
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DialogDeleteTraining;
