import { Link } from "@tanstack/react-router";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

type RoutineLiProps = {
	rutina: {
		filter: {
			_id: Id<"filters">;
			_creationTime: number;
			name: string;
			userId: string;
			color: string;
		} | null;
		exercises: {
			_id: Id<"routinesExercises">;
			exercise: {
				muscleGroup: string | null;
				_id: Id<"exercises">;
				_creationTime: number;
				name: string;
				userId: string;
				muscleGroupId: Id<"muscleGroups">;
			} | null;
			order: number;
			routineId: Id<"routines">;
			note: string | undefined;
		}[];
		_id: Id<"routines">;
		_creationTime: number;
		name: string;
		userId: string;
		filterId: Id<"filters">;
	};
};

export default function RoutineLi({ rutina }: RoutineLiProps) {
	return (
		<Link params={{ routineId: rutina._id }} to={"/rutiny/$routineId"}>
			<div className="flex items-center justify-between rounded-lg py-2">
				<p className="font-medium text-lg">{rutina.name}</p>
				<div
					className="rounded-full border px-3 py-1 text-center"
					style={{
						borderColor: rutina?.filter?.color
							? `${rutina.filter.color}99`
							: "hsl(var(--border))",
						color: rutina?.filter?.color || "hsl(var(--foreground))",
					}}
				>
					{rutina?.filter?.name || "Žádný"}
				</div>
			</div>
		</Link>
	);
}
