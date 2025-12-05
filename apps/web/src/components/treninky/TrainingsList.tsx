import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Calendar, Dumbbell } from "lucide-react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { formatDate } from "utils/date-utils.ts";
import { DialogAddExercise } from "@/components/treninky/editDialogs/DialogAddExercise.tsx";
import DialogDelete from "@/components/treninky/editDialogs/DialogDeleteTraining.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import TrainingDialog, { type Training } from "./AddNewTraining.tsx";
import TrainingLi from "./TrainingLi.tsx";

const TrainingsList = () => {
	const [toggleEdit, setToggleEdit] = useState(false);
	const { data: trainings, isLoading } = useSuspenseQuery(convexQuery(api.workouts.getUserWorkouts, {}));

	function handleSaveTraining(training: Training) {
		handleAddTraining(training);
	}

	const createWorkout = useMutation(api.workouts.createWorkout);

	const handleAddTraining = async (training: Training) => {
		await createWorkout({
			workoutDate: training.workoutDate,
			filterId: training.filterId,
			exercises: training.exercises,
		});
	};

	if (!trainings) {
		return null;
	}

	if (!(trainings || isLoading)) {
		return (
			<Card className="mx-auto max-w-[500px]">
				<CardContent className="flex flex-col items-center justify-center py-6">
					<GiWeightLiftingUp size={55} />
					<h3 className="my-3 font-semibold text-lg">Zatím žádné tréninky</h3>
					<p className="mb-5 text-center text-muted-foreground">
						Začněte sledovat své tréninky přidáním prvního tréninku.
					</p>
					<TrainingDialog onSave={handleSaveTraining} />
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto w-[90%] max-w-[500px]">
			<div className="space-y-4">
				{/* Trainings List */}
				{trainings.length > 0 ? (
					<div className="space-y-3">
						<div className="pb-4">
							<div className="-mb-2 flex flex-row items-center gap-1">
								<div className="flex-1 space-y-1">
									<h2 className="flex items-center gap-2 font-bold">
										<Dumbbell className="h-5 w-5" />
										Vaše tréninky
									</h2>
									<p className="text-muted-foreground text-sm">
										Celkem tréninků: {trainings.length}
									</p>
								</div>
								<div className="">
									<TrainingDialog onSave={handleSaveTraining} />
								</div>
							</div>
						</div>
						<Accordion className="w-full space-y-2" type="multiple">
							{trainings.map((training) => (
								<AccordionItem
									className="rounded-xl border bg-background px-4 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
									key={training._id}
									value={training._id}
								>
									<AccordionTrigger className="flex items-center gap-2 py-3 hover:no-underline">
										<Link
											className="grid w-full grid-cols-[5fr_2fr] grid-rows-2 items-center"
											params={{ trainingId: training._id }}
											to={"/treninky/$trainingId"}
										>
											<div className="font-semibold">{training.name}</div>
											<Badge variant="secondary">
												{training?.filter?.name}
											</Badge>
											<div className="col-span-2 flex items-center gap-2 text-muted-foreground text-sm">
												<Calendar className="h-4 w-4" />
												{formatDate(
													new Date(training.workoutDate),
													"PPPP"
												)}
											</div>
										</Link>
									</AccordionTrigger>
									<AccordionContent className="pb-2">
										<div className="relative flex flex-col items-stretch">
											{training.exercises.map((exercise, index) => (
												<TrainingLi
													exercise={exercise}
													index={index}
													key={exercise._id}
													len={training.exercises.length}
													toggleEdit={toggleEdit}
												/>
											))}
											<div className="mt-4 space-y-2">
												<div
													className={`${toggleEdit ? "" : "hidden"}`}
												>
													<DialogAddExercise
														order={training.exercises.length}
														trainingId={training._id}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div className="">
														<Toggle
															onClick={() =>
																setToggleEdit(
																	!toggleEdit
																)
															}
															variant="outline"
														>
															<FaPencilAlt /> Upravit
														</Toggle>
													</div>
													<div className="inline-flex self-end">
														<DialogDelete id={training._id} />
													</div>
												</div>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				) : (
					<Card className="mx-auto max-w-[500px]">
						<CardContent className="flex flex-col items-center justify-center py-6">
							<GiWeightLiftingUp size={55} />
							<h3 className="my-3 font-semibold text-lg">Zatím žádné tréninky</h3>
							<p className="mb-5 text-center text-muted-foreground">
								Začněte sledovat své tréninky přidáním prvního tréninku.
							</p>
							<TrainingDialog onSave={handleSaveTraining} />
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default TrainingsList;
