import { Link } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { formatDate } from "../../../utils/date-utils.ts";

type TrainingSummaryLinkProps = {
	training: {
		_id: Id<"workouts">;
		name: string;
		workoutDate: string;
		filter: {
			name: string;
			color: string;
		} | null;
	};
};

export function TrainingSummaryLink({ training }: TrainingSummaryLinkProps) {
	return (
		<Link
			className="flex items-center gap-3 rounded-md px-1 py-3 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
			params={{ trainingId: training._id }}
			to="/treninky/$trainingId"
		>
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="font-semibold text-base">
					{formatDate(new Date(training.workoutDate), "PPPP")}
				</div>
				{training.name && (
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<NotebookPen className="h-4 w-4 shrink-0" />
						<span className="truncate">{training.name}</span>
					</div>
				)}
			</div>

			<div
				className="shrink-0 rounded-full border px-3 py-1 text-center text-sm"
				style={{
					borderColor: training.filter?.color ? `${training.filter.color}99` : "hsl(var(--border))",
					color: training.filter?.color || "hsl(var(--foreground))",
				}}
			>
				{training.filter?.name || "Žádný"}
			</div>
		</Link>
	);
}
