import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { BicepsFlexed, LoaderCircle } from "lucide-react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

const MuscleGroupStats = () => {
	const { data: muscleGroups, isPending } = useQuery(convexQuery(api.stats.getMuscleGroupStats, {}));

	return (
		<div className="p-1">
			<p className="mb-4 flex items-center gap-3 font-bold text-lg">
				<BicepsFlexed />
				Podle partie těla
			</p>
			{isPending && (
				<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
					<LoaderCircle className="h-5 w-5 animate-spin" />
					<span>Načítám statistiky…</span>
				</div>
			)}
			<div className="grid grid-cols-3 gap-3">
				{muscleGroups?.map((muscleGroup) => (
					<div
						className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center"
						key={muscleGroup.muscleGroupId}
					>
						<p className="mt-1 font-bold text-2xl">{muscleGroup.exerciseCount}</p>
						<p className="text-muted-foreground">{muscleGroup.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default MuscleGroupStats;
