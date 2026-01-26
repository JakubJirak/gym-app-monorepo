import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

export type Training = {
	workoutDate: string;
	filterId: Id<"filters">;
};

type TrainingDialogProps = {
	onSave: (training: Training) => void;
};

const AddNewTraining = ({ onSave }: TrainingDialogProps) => {
	const { data: filters } = useSuspenseQuery(convexQuery(api.filters.getAllFilters, {}));
	const [open, setOpen] = useState<boolean>(false);

	// Safely get first filter ID
	const getDefaultFilterId = () => {
		if (filters && filters.length > 0) {
			return filters[0]._id;
		}
		return;
	};

	const [training, setTraining] = useState({
		date: undefined as Date | undefined,
		filterId: getDefaultFilterId(),
	});

	const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

	const isValidTraining = (): boolean => !!(training.date && training.filterId);

	const handleSave = () => {
		if (!(training.date && training.filterId)) {
			return;
		}

		const newTraining: Training = {
			workoutDate: training.date.toISOString(),
			filterId: training.filterId,
		};

		onSave(newTraining);
		setOpen(false);
		setTraining({
			date: undefined,
			filterId: getDefaultFilterId(),
		});
	};

	const handleCancel = () => {
		setOpen(false);
		setTraining({
			date: undefined,
			filterId: getDefaultFilterId(),
		});
	};

	const hasFilters = filters && filters.length > 0;

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button disabled={!hasFilters} size="sm">
					Přidat trénink
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Přidat nový trénink</DialogTitle>
					<DialogDescription>Vytvořte nový trénink s filtrem a datem.</DialogDescription>
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
								setTraining((prev) => ({
									...prev,
									filterId: value as Id<"filters">,
								}))
							}
							value={training.filterId}
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
						<Label>Datum tréninku *</Label>
						<Popover onOpenChange={setOpenDatePicker} open={openDatePicker}>
							<PopoverTrigger asChild>
								<Button
									className={cn(
										"w-full justify-start text-left font-normal",
										!training.date && "text-muted-foreground"
									)}
									variant="outline"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{training.date
										? format(training.date, "PPP", { locale: cs })
										: "Vyberte datum"}
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-auto p-0">
								<Calendar
									className="bg-secondary"
									locale={cs}
									mode="single"
									onSelect={(date) => {
										setTraining((prev) => ({ ...prev, date }));
										setOpenDatePicker(false);
									}}
									selected={training.date}
								/>
							</PopoverContent>
						</Popover>
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
					<Button className="w-full sm:w-auto" disabled={!isValidTraining()} onClick={handleSave}>
						Uložit trénink
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewTraining;
