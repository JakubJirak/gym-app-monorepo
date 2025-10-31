import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { formatDate } from "utils/date-utils";
import { DialogAddExercise } from "@/components/treninky/editDialogs/DialogAddExercise.tsx";
import DialogDelete from "@/components/treninky/editDialogs/DialogDeleteTraining.tsx";
import TrainingLi from "@/components/treninky/TrainingLi.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

const TrainingInfo = ({ trainingId }: { trainingId: string }) => {
	const [toggleEdit, setToggleEdit] = useState(false);
	const { data: training } = useSuspenseQuery(
		convexQuery(api.workouts.getWorkoutById, {
			workoutId: trainingId as Id<"workouts">,
		})
	);

	if (!training) return null;

	return (
		<div>
			<div className="mb-2 flex w-full items-center justify-between">
				<div className="col-span-2 flex items-center gap-2 text-muted-foreground text-sm">
					<Calendar className="h-4 w-4" />
					{formatDate(new Date(training.workoutDate), "PPPP")}
				</div>
				<Badge variant="secondary">Cviky: {training.exercises.length}</Badge>
			</div>

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
				<div className="mt-5 space-y-2">
					<div className={`${toggleEdit ? "" : "hidden"}`}>
						<DialogAddExercise order={training.exercises.length} trainingId={training._id} />
					</div>
					<div className="flex items-center justify-between">
						<div className="">
							<Toggle onClick={() => setToggleEdit(!toggleEdit)} variant="outline">
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
