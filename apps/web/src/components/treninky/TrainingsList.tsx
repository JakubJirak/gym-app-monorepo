import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Dumbbell } from "lucide-react";
import { GiWeightLiftingUp } from "react-icons/gi";
import { Separator } from "@/components/ui/separator.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import TrainingDialog, { type Training } from "./AddNewTraining.tsx";
import { TrainingSummaryLink } from "./training-summary-link.tsx";

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
									<TrainingSummaryLink training={training} />
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
