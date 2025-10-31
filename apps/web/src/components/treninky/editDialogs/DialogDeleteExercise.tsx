import { useMutation } from "convex/react";
import type React from "react";
import { FaRegTrashCan } from "react-icons/fa6";
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
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

interface DialogDeleteTraining {
	exerciseId: string;
	setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogDeleteTraining = ({ exerciseId, setOpenParent }: DialogDeleteTraining) => {
	const deleteWorkoutExercise = useMutation(api.workoutExercises.deleteWorkoutExercise);

	function handleDeleteExercise(id: string) {
		deleteWorkoutExercise({
			workoutExerciseId: id as Id<"workoutExercises">,
		});
	}

	return (
		<AlertDialog>
			{/*@ts-expect-error allright*/}
			<AlertDialogTrigger asChild>
				<Button className="mx-auto w-40" variant="destructive">
					<FaRegTrashCan className="size-3" />
					Odstranit cvik
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Jste si opravdu jistí?</AlertDialogTitle>
					<AlertDialogDescription>
						Tato akce se nedá navrátit. Navždy smaže váš cvik se všemi sériemi a poznámkami.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Zrušit</AlertDialogCancel>
					{/*@ts-expect-error allright*/}
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
