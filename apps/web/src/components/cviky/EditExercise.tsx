import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type DialogEditSet = {
	id: string;
	defaultName: string;
};

export function EditExercise({ defaultName, id }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [exName, setExName] = useState(defaultName);
	const editExercise = useMutation(api.exercises.editExercise);

	const { data: muscleGroups } = useSuspenseQuery(convexQuery(api.muscleGroups.getAllMuscleGroups, {}));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (exName !== "") {
			editExercise({
				exerciseId: id as Id<"exercises">,
				name: exName,
			});
			setOpen(false);
		}
	};

	if (!muscleGroups) {
		return null;
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button size="icon-sm" variant="outline">
						<Pencil />
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Upravit vlastní cvik</DialogTitle>
						<DialogDescription>Zde si můžete upravit vlastní cvik.</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="grid gap-4">
							<div className="grid gap-3">
								<Label htmlFor="cvik">Jméno cviku</Label>
								<Input
									id="cvik"
									name="cvik"
									onChange={(e) => setExName(e.target.value)}
									placeholder="Název cviku"
									required
									type="text"
									value={exName}
								/>
							</div>
						</div>

						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button variant="outline">Zrušit</Button>
							</DialogClose>
							<Button type="submit">Uložit cvik</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</form>
		</Dialog>
	);
}
