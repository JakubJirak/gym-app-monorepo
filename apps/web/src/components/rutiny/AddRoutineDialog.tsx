import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { Input } from "../ui/input";

export type Routine = {
	name: string;
	filterId: Id<"filters">;
};

type RoutineDialogProps = {
	onSave: (routine: Routine) => void;
};

const AddRoutineDialog = ({ onSave }: RoutineDialogProps) => {
	const { data: filters } = useSuspenseQuery(convexQuery(api.filters.getAllFilters, {}));
	const [open, setOpen] = useState<boolean>(false);

	// Safely get first filter ID
	const getDefaultFilterId = () => {
		if (filters && filters.length > 0) {
			return filters[0]._id;
		}
		return;
	};

	const [routine, setRoutine] = useState({
		name: "",
		filterId: getDefaultFilterId(),
	});

	const isValidRoutine = (): boolean => !!(routine.name && routine.filterId);

	const handleSave = () => {
		if (!(routine.name && routine.filterId)) {
			return;
		}

		const newRoutine: Routine = {
			name: routine.name,
			filterId: routine.filterId,
		};

		onSave(newRoutine);
		setOpen(false);
		setRoutine({
			name: "",
			filterId: getDefaultFilterId(),
		});
	};

	const handleCancel = () => {
		setOpen(false);
		setRoutine({
			name: "",
			filterId: getDefaultFilterId(),
		});
	};

	const hasFilters = filters && filters.length > 0;

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button disabled={!hasFilters} size="sm">
					Přidat rutinu
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Přidat novou rutinu</DialogTitle>
					<DialogDescription>Vytvořte novou rutinu s názvem a datem.</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{!hasFilters && (
						<div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
							<p className="text-sm text-yellow-600 dark:text-yellow-400">
								Pro vytvoření tréninku musíte mít alespoň jeden filtr.
							</p>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="filter-select">Filtr *</Label>
						<Select
							disabled={!hasFilters}
							onValueChange={(value) =>
								setRoutine((prev) => ({
									...prev,
									filterId: value as Id<"filters">,
								}))
							}
							value={routine.filterId}
						>
							<SelectTrigger className="w-full" id="filter-select">
								<SelectValue placeholder="Vyberte filtr" />
							</SelectTrigger>
							<SelectContent>
								{filters?.map((filter) => (
									<SelectItem key={filter._id} value={filter._id}>
										<div className="flex items-center gap-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: filter.color }}
											/>
											{filter.name}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Název rutiny *</Label>
						<Input
							onChange={(e) =>
								setRoutine((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							value={routine.name}
						/>
					</div>
				</div>

				<DialogFooter className="mt-auto flex-col gap-4 sm:flex-row">
					<Button
						className="w-full bg-transparent sm:w-auto"
						onClick={handleCancel}
						variant="outline"
					>
						Zrušit
					</Button>
					<Button className="w-full sm:w-auto" disabled={!isValidRoutine()} onClick={handleSave}>
						Uložit rutinu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddRoutineDialog;
