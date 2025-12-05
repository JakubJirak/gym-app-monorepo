import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { ExerciseSelect } from "utils/training-types";
import { ExerciseCombobox } from "@/components/treninky/ExerciseCombobox.tsx";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

export type Set = {
	reps: string;
	weight: string;
	order: number;
};

export type Exercise = {
	tempId: string;
	exerciseId: string | null;
	notes: string;
	sets: Set[];
	order: number;
};

export type Training = {
	workoutDate: string;
	filterId: Id<"filters">;
	exercises?: {
		// Změněno na optional
		exerciseId: Id<"exercises">;
		note?: string;
		order: number;
		sets?: {
			reps: number;
			weight: number;
			order: number;
		}[];
	}[];
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
		name: "",
		date: undefined as Date | undefined,
		filterId: getDefaultFilterId(),
		exercises: [] as Exercise[],
	});

	const [selectedStatuses, setSelectedStatuses] = useState<Record<string, ExerciseSelect | null>>({});
	const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

	const addExercise = () => {
		const tempId = `temp-${Date.now()}-${Math.random()}`;
		const newExercise: Exercise = {
			tempId,
			exerciseId: null,
			notes: "",
			order: training.exercises.length,
			sets: [
				{
					reps: "",
					weight: "",
					order: 0,
				},
			],
		};
		setTraining((prev) => ({
			...prev,
			exercises: [...prev.exercises, newExercise],
		}));
		setSelectedStatuses((prev) => ({
			...prev,
			[tempId]: null,
		}));
	};

	const removeExercise = (tempId: string) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises
				.filter((ex) => ex.tempId !== tempId)
				.map((ex, idx) => ({ ...ex, order: idx })),
		}));
		setSelectedStatuses((prev) => {
			const newStatuses = { ...prev };
			delete newStatuses[tempId];
			return newStatuses;
		});
	};

	const updateExercise = <K extends keyof Exercise>(tempId: string, field: K, value: Exercise[K]) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) => (ex.tempId === tempId ? { ...ex, [field]: value } : ex)),
		}));
	};

	const addSet = (tempId: string) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.tempId === tempId
					? {
							...ex,
							sets: [
								...ex.sets,
								{
									reps: "",
									weight: "",
									order: ex.sets.length,
								},
							],
						}
					: ex
			),
		}));
	};

	const removeSet = (tempId: string, setOrder: number) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.tempId === tempId
					? {
							...ex,
							sets: ex.sets
								.filter((set) => set.order !== setOrder)
								.map((set, idx) => ({ ...set, order: idx })),
						}
					: ex
			),
		}));
	};

	const updateSet = <K extends keyof Set>(tempId: string, setOrder: number, field: K, value: Set[K]) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.tempId === tempId
					? {
							...ex,
							sets: ex.sets.map((set) =>
								set.order === setOrder ? { ...set, [field]: value } : set
							),
						}
					: ex
			),
		}));
	};

	const handleSetSelectedStatus = (tempId: string, value: ExerciseSelect | null) => {
		setSelectedStatuses((prev) => ({
			...prev,
			[tempId]: value,
		}));
	};

	// Upravená funkce - nyní přijímá ExerciseSelect místo ExerciseOption
	const selectExercise = (tempId: string, selected: ExerciseSelect) => {
		updateExercise(tempId, "exerciseId", selected._id); // Změněno z selected.id na selected._id
		handleSetSelectedStatus(tempId, selected);
	};

	const isValidTraining = (): boolean => {
		if (!(training.date && training.filterId) || training.exercises.length === 0) {
			return false;
		}
		return training.exercises.every((exercise) => {
			if (exercise.exerciseId == null) {
				return false;
			}
			return exercise.sets.some((set) => set.reps.trim() !== "" && set.weight.trim() !== "");
		});
	};

	const handleSave = () => {
		if (!(training.date && training.filterId)) {
			return;
		}

		const newTraining: Training = {
			workoutDate: training.date.toISOString(),
			filterId: training.filterId,
			exercises: training.exercises.map((ex) => ({
				exerciseId: ex.exerciseId as Id<"exercises">,
				note: ex.notes.trim() || undefined,
				order: ex.order,
				sets: ex.sets
					.filter((set) => set.reps.trim() !== "" && set.weight.trim() !== "")
					.map((set) => ({
						reps: Number.parseFloat(set.reps),
						weight: Number.parseFloat(set.weight),
						order: set.order,
					})),
			})),
		};

		onSave(newTraining);
		setOpen(false);
		setTraining({
			name: "",
			date: undefined,
			filterId: getDefaultFilterId(),
			exercises: [],
		});
		setSelectedStatuses({});
	};

	const handleCancel = () => {
		setOpen(false);
		setTraining({
			name: "",
			date: undefined,
			filterId: getDefaultFilterId(),
			exercises: [],
		});
		setSelectedStatuses({});
	};

	const hasFilters = filters && filters.length > 0;

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button disabled={!hasFilters} size="sm">
					Přidat trénink
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[98vh] w-[95vw] max-w-4xl p-4 pt-6 sm:w-full">
				<DialogHeader>
					<DialogTitle>Přidat nový trénink</DialogTitle>
					<DialogDescription>Vytvořte nový trénink s cviky a sériemi.</DialogDescription>
				</DialogHeader>

				{/*@ts-expect-error not a valid error */}
				<ScrollArea className="max-h-[68dvh] min-h-[60dvh] pr-4">
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

						<div className="space-y-4">
							<div className="top-100 z-1000 flex w-full items-center justify-between">
								<Label className="font-semibold text-base">Cviky *</Label>
								<Button onClick={addExercise} size="sm">
									<Plus className="mr-2 h-4 w-4" />
									Přidat cvik
								</Button>
							</div>
							{training.exercises.length > 0 && (
								<div className="space-y-4">
									{training.exercises.map((exercise, exerciseIndex) => (
										<div
											className="relative space-y-4 rounded-lg border bg-secondary p-4"
											key={exercise.tempId}
										>
											<div className="flex items-start gap-2">
												<div className="flex-1 space-y-2">
													<div className="flex w-full">
														<Label className="flex-1 font-medium text-sm">
															{exerciseIndex + 1}. Cvik
														</Label>
														<Button
															className="shrink-0"
															onClick={() =>
																removeExercise(
																	exercise.tempId
																)
															}
															size="icon-sm"
															variant="muted"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
													<ExerciseCombobox
														exerciseId={exercise.tempId}
														selectExercise={selectExercise}
														selectedStatus={
															selectedStatuses[
																exercise.tempId
															] ?? null
														}
														setSelectedStatus={(value) =>
															handleSetSelectedStatus(
																exercise.tempId,
																value
															)
														}
													/>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<Label className="font-medium text-sm">
														Série
													</Label>
													<Button
														onClick={() =>
															addSet(exercise.tempId)
														}
														size="sm"
														variant="outline"
													>
														<Plus className="mr-1 h-3 w-3" />
														Přidat sérii
													</Button>
												</div>
												<div className="space-y-2">
													{exercise.sets.map((set, setIndex) => (
														<div
															className="grid grid-cols-[1fr_1fr_32px] items-end gap-2 sm:grid-cols-3"
															key={set.order}
														>
															<Label className="text-sm">
																{setIndex + 1}. série
															</Label>
															<div className="sm:hidden" />
															<div className="sm:hidden" />
															<div className="hidden sm:block" />
															<div className="hidden sm:block" />
															<div>
																<Label className="sr-only text-xs">
																	Váha
																</Label>
																<div className="mb-1 text-muted-foreground text-xs">
																	Váha (kg)
																</div>
																<Input
																	className="h-8"
																	max={10_000}
																	min={0}
																	onChange={(e) =>
																		updateSet(
																			exercise.tempId,
																			set.order,
																			"weight",
																			e
																				.target
																				.value
																		)
																	}
																	step={0.25}
																	type="number"
																	value={set.weight}
																/>
															</div>
															<div>
																<div className="mb-1 text-muted-foreground text-xs">
																	Opakování
																</div>
																<Input
																	className="h-8"
																	max={10_000}
																	min={0}
																	onChange={(e) =>
																		updateSet(
																			exercise.tempId,
																			set.order,
																			"reps",
																			e
																				.target
																				.value
																		)
																	}
																	step={1}
																	type="number"
																	value={set.reps}
																/>
															</div>
															<Button
																className="h-8 w-8 shrink-0"
																onClick={() =>
																	removeSet(
																		exercise.tempId,
																		set.order
																	)
																}
																size="icon"
																variant="destructive"
															>
																<Trash2 className="h-3 w-3" />
															</Button>
														</div>
													))}
												</div>
											</div>
											<div className="flex flex-col gap-2">
												<Label className="font-medium text-sm">
													Poznámky (volitelné)
												</Label>
												<Input
													className="text-sm placeholder:text-sm"
													onChange={(e) =>
														updateExercise(
															exercise.tempId,
															"notes",
															e.target.value
														)
													}
													placeholder="Přidejte poznámky k tomuto cviku..."
													value={exercise.notes}
												/>
												<div className="self-end">
													<Button
														className="mt-2 inline-flex"
														onClick={addExercise}
														size="sm"
														variant="outline"
													>
														<Plus className="mr-1" />
														Další cvik
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
							{training.exercises.length === 0 && (
								<div className="rounded-lg border py-8 text-center text-muted-foreground">
									<p>Zatím nebyly přidány žádné cviky.</p>
									<p className="text-sm">Klikněte na "Přidat cvik" pro začátek.</p>
								</div>
							)}
						</div>
					</div>
				</ScrollArea>
				<Separator />
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
