import { formatSetInfo } from "utils/training-format";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

type Exercise = {
	_id: Id<"workoutExercises">;
	exercise: {
		muscleGroup: string | null;
		_id: Id<"exercises">;
		_creationTime: number;
		userId: string;
		name: string;
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

type Props = {
	exercise: Exercise;
	index: number;
	len: number;
};

const CalendarTrainingLi = ({ exercise, index, len }: Props) => (
	<div className="mt-2 space-y-3 rounded-lg" key={exercise._id}>
		<div className="flex justify-between">
			<h4 className="font-semibold text-lg">{exercise?.exercise?.name}</h4>
			<Badge variant="outline">{exercise.exercise?.muscleGroup}</Badge>
		</div>
		<div />

		<div>
			<div className="grid gap-2">
				{exercise.sets.map((set, setIndex) => (
					<div className="flex items-center rounded-md bg-secondary px-3 py-2" key={set._id}>
						<span className="flex-1 text-sm">{setIndex + 1}. série</span>
						<span className="mr-2 font-medium text-sm">{formatSetInfo(set)}</span>
					</div>
				))}
			</div>
		</div>

		{exercise.note && <p className="text-muted-foreground text-sm">{exercise.note}</p>}
		{index !== len - 1 && <Separator />}
	</div>
);

export default CalendarTrainingLi;
