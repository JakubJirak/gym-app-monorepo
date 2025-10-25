import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "../ui/separator";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { formatSetInfo } from "utils/training-format";

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

interface Props {
	exercise: Exercise;
	index: number;
	len: number;
}

const CalendarTrainingLi = ({ exercise, index, len }: Props) => {
	return (
		<div key={exercise._id} className="rounded-lg mt-2 space-y-3">
			<div className="flex justify-between">
				<h4 className="font-semibold text-lg">{exercise?.exercise?.name}</h4>
				<Badge variant="outline">{exercise?.exercise?.muscleGroup}</Badge>
			</div>

			<div>
				<div className="grid gap-2">
					{exercise.sets.map((set, setIndex) => (
						<div
							key={set._id}
							className="flex items-center bg-secondary rounded-md py-2 px-3"
						>
							<span className="text-sm flex-1">{setIndex + 1}. série</span>
							<span className="text-sm font-medium mr-2">
								{formatSetInfo(set)}
							</span>
						</div>
					))}
				</div>
			</div>

			{exercise.note && (
				<p className="text-sm text-muted-foreground">{exercise.note}</p>
			)}
			{index !== len - 1 && <Separator />}
		</div>
	);
};

export default CalendarTrainingLi;
