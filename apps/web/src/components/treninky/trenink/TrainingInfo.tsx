import TrainingLi from "@/components/treninky/TrainingLi.tsx";
import { DialogAddExercise } from "@/components/treninky/editDialogs/DialogAddExercise.tsx";
import DialogDelete from "@/components/treninky/editDialogs/DialogDeleteTraining.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import { formatDate } from "utils/date-utils";

const TrainingInfo = ({ trainingId }: { trainingId: string }) => {
	const [toggleEdit, setToggleEdit] = useState(false);
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		}),
	);

	if (!training) return null;

	return (
		<div>
			<div className="w-full flex justify-between items-center mb-2">
				<div className="flex col-span-2 items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-4 w-4" />
					{formatDate(new Date(training.workoutDate), "PPPP")}
				</div>
				<Badge variant="secondary">Cviky: {training.exercises.length}</Badge>
			</div>

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
				<div className="space-y-2 mt-5">
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
		</div>
	);
};

export default TrainingInfo;
