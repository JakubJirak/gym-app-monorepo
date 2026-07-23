import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Dumbbell, NotebookPen } from "lucide-react";
import { GiWeightLiftingUp } from "react-icons/gi";
import { Separator } from "@/components/ui/separator.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { formatDate } from "../../../utils/date-utils.ts";
import TrainingDialog, { type Training } from "./AddNewTraining.tsx";

const TrainingsList = () => {
	const { data: trainings } = useSuspenseQuery(convexQuery(api.workouts.getUserWorkoutSummaries, {}));

	function handleSaveTraining(training: Training) {
		handleAddTraining(training);
	}

	const createWorkout = useMutation(api.workouts.createWorkout);

	const handleAddTraining = async (training: Training) => {
		await createWorkout({
			workoutDate: training.workoutDate,
			filterId: training.filterId,
		});
	};

	return (
		<div className="container mx-auto w-[90%] max-w-125">
			<div className="space-y-4">
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
						<div>
							{trainings.map((training, index) => (
								<div key={training._id}>
									<Link
										className="flex items-center gap-3 rounded-md px-1 py-3 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
										params={{ trainingId: training._id }}
										to="/treninky/$trainingId"
									>
										<div className="flex min-w-0 flex-1 flex-col gap-1">
											<div className="font-semibold text-base">
												{formatDate(
													new Date(training.workoutDate),
													"PPPP"
												)}
											</div>
											{training.name && (
												<div className="flex items-center gap-2 text-muted-foreground text-sm">
													<NotebookPen className="h-4 w-4 shrink-0" />
													<span className="truncate">
														{training.name}
													</span>
												</div>
											)}
										</div>

										<div
											className="shrink-0 rounded-full border px-3 py-1 text-center text-sm"
											style={{
												borderColor: training.filter?.color
													? `${training.filter.color}99`
													: "hsl(var(--border))",
												color:
													training.filter?.color ||
													"hsl(var(--foreground))",
											}}
										>
											{training.filter?.name || "Žádný"}
										</div>
									</Link>
									{index < trainings.length - 1 && <Separator />}
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-6">
						<GiWeightLiftingUp size={55} />
						<h3 className="my-3 font-semibold text-lg">Zatím žádné tréninky</h3>
						<p className="mb-5 text-center text-muted-foreground">
							Začněte sledovat své tréninky přidáním prvního tréninku.
						</p>
						<TrainingDialog onSave={handleSaveTraining} />
					</div>
				)}
			</div>
		</div>
	);
};

export default TrainingsList;
