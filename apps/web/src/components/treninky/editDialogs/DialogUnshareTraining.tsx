import { useMutation } from "convex/react";
import { Share2 } from "lucide-react";
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
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type DialogEditSet = {
  trainingId: string;
};

export function DialogUnshareTraining({ trainingId }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
  const unshareTraining = useMutation(api.workouts.disableWorkoutSharing);

	function handleUnshareTraining() {
		unshareTraining({ workoutId: trainingId as Id<"workouts"> });
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
    handleUnshareTraining();
		setOpen(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button variant="outline">
						<Share2 /> Zrušit sdílení
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>Zrušit sdílení tréninku</DialogTitle>
						<DialogDescription>Zde můžete zrušit sdílení tréninku s ostatními uživateli.</DialogDescription>
					</DialogHeader>
						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button variant="outline">Zrušit</Button>
							</DialogClose>
							<Button onClick={handleSubmit}>Zrušit sdílení</Button>
						</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
