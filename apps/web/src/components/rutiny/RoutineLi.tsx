import { Link } from "@tanstack/react-router";
import type { api } from "../../../../../packages/convex/convex/_generated/api";

type RoutineLiProps = {
	rutina: (typeof api.routines.getUserRoutineSummaries._returnType)[number];
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
