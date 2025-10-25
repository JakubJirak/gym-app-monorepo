import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ExerciseSelect } from "utils/training-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

export interface Set {
	reps: string;
	weight: string;
	order: number;
}

export interface Exercise {
	tempId: string;
	name: string;
	exerciseId: string | null;
	notes: string;
	sets: Set[];
	order: number;
}

export interface Training {
	name: string;
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
}

interface TrainingDialogProps {
	onSave: (training: Training) => void;
}

const AddNewTraining = ({ onSave }: TrainingDialogProps) => {
	const { data: filters } = useSuspenseQuery(
		convexQuery(api.filters.getAllFilters, {}),
	);
	const [open, setOpen] = useState<boolean>(false);

	// Safely get first filter ID
	const getDefaultFilterId = () => {
		if (filters && filters.length > 0) return filters[0]._id;
		return undefined;
	};

	const [training, setTraining] = useState({
		name: "",
		date: undefined as Date | undefined,
		filterId: getDefaultFilterId(),
		exercises: [] as Exercise[],
	});

	const [selectedStatuses, setSelectedStatuses] = useState<
		Record<string, ExerciseSelect | null>
	>({});
	const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

	const addExercise = () => {
		const tempId = `temp-${Date.now()}-${Math.random()}`;
		const newExercise: Exercise = {
			tempId,
			name: "",
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

	const updateExercise = <K extends keyof Exercise>(
		tempId: string,
		field: K,
		value: Exercise[K],
	) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.tempId === tempId ? { ...ex, [field]: value } : ex,
			),
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
					: ex,
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
					: ex,
			),
		}));
	};

	const updateSet = <K extends keyof Set>(
		tempId: string,
		setOrder: number,
		field: K,
		value: Set[K],
	) => {
		setTraining((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.tempId === tempId
					? {
							...ex,
							sets: ex.sets.map((set) =>
								set.order === setOrder ? { ...set, [field]: value } : set,
							),
						}
					: ex,
			),
		}));
	};

	const handleSetSelectedStatus = (
		tempId: string,
		value: ExerciseSelect | null,
	) => {
		setSelectedStatuses((prev) => ({
			...prev,
			[tempId]: value,
		}));
	};

	// Upravená funkce - nyní přijímá ExerciseSelect místo ExerciseOption
	const selectExercise = (tempId: string, selected: ExerciseSelect) => {
		updateExercise(tempId, "name", selected.name);
		updateExercise(tempId, "exerciseId", selected._id); // Změněno z selected.id na selected._id
		handleSetSelectedStatus(tempId, selected);
	};

	const isValidTraining = (): boolean => {
		if (
			!training.name.trim() ||
			!training.date ||
			!training.filterId ||
			training.exercises.length === 0
		) {
			return false;
		}
		return training.exercises.every((exercise) => {
			if (!exercise.name.trim() || exercise.exerciseId == null) return false;
			return exercise.sets.some(
				(set) => set.reps.trim() !== "" && set.weight.trim() !== "",
			);
		});
	};

	const handleSave = () => {
		if (!training.date || !training.filterId) return;

		const newTraining: Training = {
			name: training.name,
			workoutDate: training.date.toISOString(),
			filterId: training.filterId,
			exercises: training.exercises.map((ex) => ({
				exerciseId: ex.exerciseId as Id<"exercises">,
				note: ex.notes.trim() || undefined,
				order: ex.order,
				sets: ex.sets
					.filter((set) => set.reps.trim() !== "" && set.weight.trim() !== "")
					.map((set) => ({
						reps: parseFloat(set.reps),
						weight: parseFloat(set.weight),
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" disabled={!hasFilters}>
					Přidat trénink
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl p-4 pt-6 max-h-[98vh] w-[95vw] sm:w-full">
				<DialogHeader>
					<DialogTitle>Přidat nový trénink</DialogTitle>
					<DialogDescription>
						Vytvořte nový trénink s cviky a sériemi.
					</DialogDescription>
				</DialogHeader>

				{/*@ts-ignore*/}
				<ScrollArea className="max-h-[68dvh] min-h-[60dvh] pr-4">
					<div className="space-y-6">
						{!hasFilters && (
							<div className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg">
								<p className="text-sm text-yellow-600 dark:text-yellow-400">
									Pro vytvoření tréninku musíte mít alespoň jeden filtr.
								</p>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="training-name">Název tréninku *</Label>
							<Input
								id="training-name"
								placeholder="Zadejte název tréninku"
								className="placeholder:text-sm text-sm"
								value={training.name}
								onChange={(e) =>
									setTraining((prev) => ({ ...prev, name: e.target.value }))
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="filter-select">Filtr *</Label>
							<Select
								value={training.filterId}
								onValueChange={(value) =>
									setTraining((prev) => ({
										...prev,
										filterId: value as Id<"filters">,
									}))
								}
								disabled={!hasFilters}
							>
								<SelectTrigger id="filter-select" className="w-full">
									<SelectValue placeholder="Vyberte filtr" />
								</SelectTrigger>
								<SelectContent>
									{filters?.map((filter) => (
										<SelectItem key={filter._id} value={filter._id}>
											<div className="flex items-center gap-2">
												<div
													className="w-3 h-3 rounded-full"
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
							<Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!training.date && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{training.date
											? format(training.date, "PPP", { locale: cs })
											: "Vyberte datum"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										className="bg-secondary"
										mode="single"
										selected={training.date}
										onSelect={(date) => {
											setTraining((prev) => ({ ...prev, date }));
											setOpenDatePicker(false);
										}}
										locale={cs}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between top-100 z-1000 w-full">
								<Label className="text-base font-semibold">Cviky *</Label>
								<Button onClick={addExercise} size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Přidat cvik
								</Button>
							</div>
							{training.exercises.length > 0 && (
								<div className="space-y-4">
									{training.exercises.map((exercise, exerciseIndex) => (
										<div
											key={exercise.tempId}
											className="border rounded-lg bg-secondary p-4 space-y-4 relative"
										>
											<div className="flex items-start gap-2">
												<div className="flex-1 space-y-2">
													<div className="flex w-full">
														<Label className="text-sm font-medium flex-1">
															{exerciseIndex + 1}. Cvik
														</Label>
														<Button
															variant="muted"
															size="icon-sm"
															onClick={() => removeExercise(exercise.tempId)}
															className="shrink-0"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
													<ExerciseCombobox
														selectedStatus={
															selectedStatuses[exercise.tempId] ?? null
														}
														setSelectedStatus={(value) =>
															handleSetSelectedStatus(exercise.tempId, value)
														}
														exerciseId={exercise.tempId}
														selectExercise={selectExercise}
													/>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<Label className="text-sm font-medium">Série</Label>
													<Button
														onClick={() => addSet(exercise.tempId)}
														size="sm"
														variant="outline"
													>
														<Plus className="h-3 w-3 mr-1" />
														Přidat sérii
													</Button>
												</div>
												<div className="space-y-2">
													{exercise.sets.map((set, setIndex) => (
														<div
															key={set.order}
															className="grid grid-cols-[1fr_1fr_32px] sm:grid-cols-3 gap-2 items-end"
														>
															<Label className="text-sm">
																{setIndex + 1}. série
															</Label>
															<div className="sm:hidden" />
															<div className="sm:hidden" />
															<div className="hidden sm:block" />
															<div className="hidden sm:block" />
															<div>
																<Label className="text-xs sr-only">Váha</Label>
																<div className="text-xs mb-1 text-muted-foreground">
																	Váha (kg)
																</div>
																<Input
																	type="number"
																	value={set.weight}
																	min={0}
																	max={10000}
																	step={0.25}
																	onChange={(e) =>
																		updateSet(
																			exercise.tempId,
																			set.order,
																			"weight",
																			e.target.value,
																		)
																	}
																	className="h-8"
																/>
															</div>
															<div>
																<div className="text-xs mb-1 text-muted-foreground">
																	Opakování
																</div>
																<Input
																	type="number"
																	min={0}
																	max={10000}
																	step={1}
																	value={set.reps}
																	onChange={(e) =>
																		updateSet(
																			exercise.tempId,
																			set.order,
																			"reps",
																			e.target.value,
																		)
																	}
																	className="h-8"
																/>
															</div>
															<Button
																variant="destructive"
																size="icon"
																onClick={() =>
																	removeSet(exercise.tempId, set.order)
																}
																className="h-8 w-8 shrink-0"
															>
																<Trash2 className="h-3 w-3" />
															</Button>
														</div>
													))}
												</div>
											</div>
											<div className="flex flex-col gap-2">
												<Label className="text-sm font-medium">
													Poznámky (volitelné)
												</Label>
												<Input
													placeholder="Přidejte poznámky k tomuto cviku..."
													value={exercise.notes}
													className="placeholder:text-sm text-sm"
													onChange={(e) =>
														updateExercise(
															exercise.tempId,
															"notes",
															e.target.value,
														)
													}
												/>
												<div className="self-end">
													<Button
														onClick={addExercise}
														variant="outline"
														className="inline-flex mt-2"
														size="sm"
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
								<div className="text-center py-8 text-muted-foreground border rounded-lg">
									<p>Zatím nebyly přidány žádné cviky.</p>
									<p className="text-sm">
										Klikněte na "Přidat cvik" pro začátek.
									</p>
								</div>
							)}
						</div>
					</div>
				</ScrollArea>
				<Separator />
				<DialogFooter className="flex-col sm:flex-row gap-4 mt-auto">
					<Button
						variant="outline"
						onClick={handleCancel}
						className="w-full sm:w-auto bg-transparent"
					>
						Zrušit
					</Button>
					<Button
						onClick={handleSave}
						className="w-full sm:w-auto"
						disabled={!isValidTraining()}
					>
						Uložit trénink
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewTraining;
