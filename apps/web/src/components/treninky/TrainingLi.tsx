import { EditOptionsDialog } from "@/components/treninky/EditOptionsDialog.tsx";
import { DialogEditSet } from "@/components/treninky/editDialogs/DialogEditSet.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatSetInfo } from "utils/training-format";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type Exercise = {
	_id: Id<"workoutExercises">;
	exercise: {
		muscleGroup: string | null;
		_id: Id<"exercises">;
		_creationTime: number;
		name: string;
		userId: string;
		muscleGroupId: Id<"muscleGroups">;
	} | null;
	note: string | undefined;
	order: number;
	sets: {
		_id: Id<"sets">;
		reps: number;
		weight: number;
		order: number;
	}[];
};

interface TrainingLiProps {
	exercise: Exercise;
	toggleEdit: boolean;
	index: number;
	len: number;
}

const TrainingLi = ({ exercise, toggleEdit, index, len }: TrainingLiProps) => {
	return (
		<div key={exercise._id} className="rounded-lg mt-2 space-y-3">
			<div className={`${toggleEdit ? "" : "justify-between"} flex items-center`}>
				<h4 className="font-semibold text-lg">{exercise?.exercise?.name} </h4>
				<div className={`${toggleEdit ? "flex ml-2 mr-auto gap-1.5" : "hidden"}`}>
					<EditOptionsDialog order={exercise.sets.length} exerciseId={exercise._id} />
				</div>
				<Badge variant="outline">{exercise?.exercise?.muscleGroup}</Badge>
			</div>

			<div>
				<div className="grid gap-2">
					{exercise.sets.map((set, setIndex) => (
						<div key={set._id} className="flex items-center bg-secondary rounded-md py-2 px-3">
							<span className="text-sm flex-1">{setIndex + 1}. série</span>
							<span className="text-sm font-medium mr-2">{formatSetInfo(set)}</span>
							<div className={`${toggleEdit ? "block" : "hidden"}`}>
								<DialogEditSet
									repsBefore={String(set.reps)}
									weightBefore={String(set.weight)}
									setId={set._id}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{exercise.note && <p className="text-sm text-muted-foreground">{exercise.note}</p>}

			{index !== len - 1 && <Separator />}
		</div>
	);
};

export default TrainingLi;
