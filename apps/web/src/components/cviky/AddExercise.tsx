import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command.tsx";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type DialogEditSet = {
	defaultName: string;
};

export function AddExercise({ defaultName }: DialogEditSet) {
	const [open, setOpen] = useState<boolean>(false);
	const [popOpen, setPopOpen] = useState<boolean>(false);
	const [exName, setExName] = useState(defaultName);
	const [value, setValue] = useState("");
	const addExercise = useMutation(api.exercises.addExercise);

	const { data: muscleGroups } = useSuspenseQuery(convexQuery(api.muscleGroups.getAllMuscleGroups, {}));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (value !== "") {
			addExercise({
				name: exName,
				muscleGroupId: value as Id<"muscleGroups">,
			});
			setOpen(false);
			setValue("");
		}
	};

	if (!muscleGroups) {
		return null;
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button size="icon">
						<Plus />
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Přidat vlastní cvik</DialogTitle>
						<DialogDescription>Zde si můžete přidat vlastní cvik.</DialogDescription>
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

						<div className="grid gap-3">
							<Label htmlFor="cvik">Jméno části těla</Label>
							<Popover onOpenChange={setPopOpen} open={popOpen}>
								<PopoverTrigger asChild>
									<Button
										aria-expanded={popOpen}
										className="w-full justify-between"
										variant="outline"
									>
										{value
											? muscleGroups.find(
													(muscleGroup) => muscleGroup._id === value
												)?.name
											: "Vyber část těla..."}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-full p-0">
									<Command>
										<CommandList>
											<CommandEmpty>Nic se nenašlo.</CommandEmpty>
											<CommandGroup>
												{muscleGroups.map((muscleGroup) => (
													<CommandItem
														key={muscleGroup._id}
														onSelect={(currentValue) => {
															setValue(
																currentValue === value
																	? ""
																	: currentValue
															);
															setPopOpen(false);
														}} // Tady je id!
														value={muscleGroup._id}
													>
														{muscleGroup.name}
														<Check
															className={cn(
																"ml-auto",
																value ===
																	muscleGroup._id
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
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
