import { useMutation } from "convex/react";
import { Copy, Share2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type DialogEditSet = {
	trainingId: string;
};

export function DialogUnshareTraining({ trainingId }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState(false);
	const unshareTraining = useMutation(api.workouts.disableWorkoutSharing);
	const sharedUrl = `https://gymtracker.jirak.dev/shared/${trainingId}`;

	function handleUnshareTraining() {
		unshareTraining({ workoutId: trainingId as Id<"workouts"> });
	}

	const handleCopy = async () => {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(sharedUrl);
			} else {
				const tempInput = document.createElement("input");
				tempInput.value = sharedUrl;
				document.body.appendChild(tempInput);
				tempInput.select();
				document.execCommand("copy");
				document.body.removeChild(tempInput);
			}
		} catch {
			// Keep visual feedback even if clipboard API is restricted.
		}

		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

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
						<DialogDescription>
							Zde můžete zrušit sdílení tréninku s ostatními uživateli.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-2 flex items-center gap-2">
						<Input readOnly value={sharedUrl} />
						<Button
							className={`${copied && "bg-green-400"}`}
							onClick={handleCopy}
							type="button"
							variant="outline"
						>
							<Copy color={`${copied ? "green" : "white"}`} />
						</Button>
					</div>
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
