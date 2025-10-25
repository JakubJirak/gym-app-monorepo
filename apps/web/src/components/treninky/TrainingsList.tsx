import { Calendar, Dumbbell } from "lucide-react";
import { DialogAddExercise } from "@/components/treninky/editDialogs/DialogAddExercise.tsx";
import DialogDelete from "@/components/treninky/editDialogs/DialogDeleteTraining.tsx";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import TrainingDialog, { type Training } from "./AddNewTraining.tsx";
import TrainingLi from "./TrainingLi.tsx";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { formatDate } from "utils/date-utils.ts";
import { useMutation } from "convex/react";

const TrainingsList = () => {
	const [toggleEdit, setToggleEdit] = useState(false);
	const { data: trainings, isLoading } = useSuspenseQuery(
		convexQuery(api.workouts.getUserWorkouts, {}),
	);

	async function handleSaveTraining(training: Training) {
		handleAddTraining(training);
	}

	const createWorkout = useMutation(api.workouts.createWorkout);

	const handleAddTraining = async (training: Training) => {
		await createWorkout({
			name: training.name,
			workoutDate: training.workoutDate,
			filterId: training.filterId,
			exercises: training.exercises,
		});
	};

	if (!trainings) return null;

	if (!trainings && !isLoading)
		return (
			<Card className="max-w-[500px] mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-6">
					<GiWeightLiftingUp size={55} />
					<h3 className="text-lg font-semibold my-3">Zatím žádné tréninky</h3>
					<p className="text-muted-foreground text-center mb-5">
						Začněte sledovat své tréninky přidáním prvního tréninku.
					</p>
					<TrainingDialog onSave={handleSaveTraining} />
				</CardContent>
			</Card>
		);

	return (
		<div className="container mx-auto w-[90%] max-w-[500px]">
			<div className="space-y-4">
				{/* Trainings List */}
				{trainings.length > 0 ? (
					<div className="space-y-3">
						<div className="pb-4">
							<div className="flex flex-row gap-1 items-center -mb-2">
								<div className="flex-1 space-y-1">
									<h2 className="flex items-center gap-2 font-bold">
										<Dumbbell className="h-5 w-5" />
										Vaše tréninky
									</h2>
									<p className="text-sm text-muted-foreground">
										Celkem tréninků: {trainings.length}
									</p>
								</div>
								<div className="">
									<TrainingDialog onSave={handleSaveTraining} />
								</div>
							</div>
						</div>
						<Accordion type="multiple" className="w-full space-y-2">
							{trainings.map((training) => (
								<AccordionItem
									key={training._id}
									value={training._id}
									className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-xl border px-4 outline-none last:border-b has-focus-visible:ring-[3px]"
								>
									<AccordionTrigger className="hover:no-underline flex items-center py-3 gap-2">
										<Link
											className="w-full grid grid-cols-[5fr_2fr] items-center grid-rows-2"
											to={"/treninky/$trainingId"}
											params={{ trainingId: training._id }}
										>
											<div className="font-semibold">{training.name}</div>
											<Badge variant="secondary">
												Cviky: {training.exercises.length}
											</Badge>
											<div className="flex col-span-2 items-center gap-2 text-sm text-muted-foreground">
												<Calendar className="h-4 w-4" />
												{formatDate(new Date(training.workoutDate), "PPPP")}
											</div>
										</Link>
									</AccordionTrigger>
									<AccordionContent className="pb-2">
										<div className="flex flex-col items-stretch relative">
											{training.exercises.map((exercise, index) => (
												<TrainingLi
													key={exercise._id}
													exercise={exercise}
													toggleEdit={toggleEdit}
													index={index}
													len={training.exercises.length}
												/>
											))}
											<div className="space-y-2 mt-4">
												<div className={`${toggleEdit ? "" : "hidden"}`}>
													<DialogAddExercise
														trainingId={training._id}
														order={training.exercises.length}
													/>
												</div>
												<div className="flex justify-between items-center">
													<div className="">
														<Toggle
															variant="outline"
															onClick={() => setToggleEdit(!toggleEdit)}
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
					<Card className="max-w-[500px] mx-auto">
						<CardContent className="flex flex-col items-center justify-center py-6">
							<GiWeightLiftingUp size={55} />
							<h3 className="text-lg font-semibold my-3">
								Zatím žádné tréninky
							</h3>
							<p className="text-muted-foreground text-center mb-5">
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
