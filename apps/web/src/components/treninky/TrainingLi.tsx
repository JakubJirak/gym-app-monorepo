import { formatSetInfo } from "utils/training-format";
import { EditOptionsDialog } from "@/components/treninky/EditOptionsDialog.tsx";
import { DialogEditSet } from "@/components/treninky/editDialogs/DialogEditSet.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

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
	workoutId: string;
};

type TrainingLiProps = {
	exercise: Exercise;
	toggleEdit: boolean;
	index: number;
	len: number;
	workoutId: string;
};

const TrainingLi = ({ exercise, toggleEdit, index, len }: TrainingLiProps) => (
	<div className="mt-2 space-y-3 rounded-lg" key={exercise._id}>
		<div className={`${toggleEdit ? "" : "justify-between"} flex items-center`}>
			<h4 className="font-semibold text-lg">{exercise?.exercise?.name}</h4>
			<div className={`${toggleEdit ? "mr-auto ml-2 flex gap-1.5" : "hidden"}`}>
				<EditOptionsDialog
					exerciseId={exercise._id}
					isFirst={index === 0}
					isLast={index === len - 1}
					order={index}
					orderSet={exercise.sets.length}
					workoutId={exercise.workoutId}
				/>
			</div>
			<Badge variant="outline">{exercise?.exercise?.muscleGroup}</Badge>
		</div>

		<div>
			<div className="grid gap-2">
				{exercise.sets.map((set, setIndex) => (
					<div className="flex items-center rounded-md bg-secondary px-3 py-2" key={set._id}>
						<span className="flex-1 text-sm">{setIndex + 1}. série</span>
						<span className="mr-2 font-medium text-sm">{formatSetInfo(set)}</span>
						<div className={`${toggleEdit ? "block" : "hidden"}`}>
							<DialogEditSet
								repsBefore={String(set.reps)}
								setId={set._id}
								weightBefore={String(set.weight)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>

		{exercise.note && <p className="text-muted-foreground text-sm">{exercise.note}</p>}

		{index !== len - 1 && <Separator />}
	</div>
);

export default TrainingLi;
