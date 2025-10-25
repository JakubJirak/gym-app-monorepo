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
import { FaRegTrashCan } from "react-icons/fa6";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { useRouter } from "@tanstack/react-router";

const DialogDeleteTraining = ({ id }: { id: string }) => {
	const deleteTraining = useMutation(api.workouts.deleteWorkout);
	const router = useRouter();

	const handleDeleteTraining = (id: string) => {
		deleteTraining({ workoutId: id as Id<"workouts"> });
		router.navigate({ to: "/treninky" });
	};

	return (
		<AlertDialog>
			{/*@ts-ignore */}
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
						Tato akce se nedá navrátit. Navždy smaže váš trénink se všemi cviky,
						sériemi a poznámkami.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Zrušit</AlertDialogCancel>
					{/*@ts-ignore */}
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
