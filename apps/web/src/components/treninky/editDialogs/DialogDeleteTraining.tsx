import { useRouter } from "@tanstack/react-router";
import { useMutation } from "convex/react";
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

const DialogDeleteTraining = ({ id }: { id: string }) => {
	const deleteTraining = useMutation(api.workouts.deleteWorkout);
	const router = useRouter();

	const handleDeleteTraining = (idTr: string) => {
		deleteTraining({ workoutId: idTr as Id<"workouts"> });
		router.navigate({ to: "/treninky" });
	};

	return (
		<AlertDialog>
			{/*@ts-expect-error allright*/}
			<AlertDialogTrigger asChild>
				<Button variant="destructive">
					<FaRegTrashCan />
					Vymazat trénink
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Jste si opravdu jistí?</AlertDialogTitle>
					<AlertDialogDescription>
						Tato akce se nedá navrátit. Navždy smaže váš trénink se všemi cviky, sériemi a
						poznámkami.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Zrušit</AlertDialogCancel>
					{/*@ts-expect-error allright*/}
					<AlertDialogAction asChild onClick={() => handleDeleteTraining(id)}>
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
