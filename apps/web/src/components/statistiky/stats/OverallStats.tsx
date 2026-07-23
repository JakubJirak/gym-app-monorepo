import { Calendar, ChartColumnIncreasing, Repeat, TrendingUp, Weight } from "lucide-react";
import type { api } from "../../../../../../packages/convex/convex/_generated/api";

type OverallStatsProps = {
	stats: typeof api.stats.getOverallStats._returnType;
};

const OverallStats = ({ stats }: OverallStatsProps) => {
	const totalWeightTons = (stats.volumeKg / 1000).toFixed(1);

	return (
		<div className="p-1">
			<p className="mb-4 flex items-center gap-3 font-bold text-lg">
				<ChartColumnIncreasing />
				Celkové statistiky
			</p>
			<div className="gird-rows-2 grid grid-cols-2 gap-5">
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Calendar />
					<p className="mt-1 font-bold text-2xl">{stats.workoutCount}</p>
					<p className="text-muted-foreground">Tréninky</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<TrendingUp />
					<p className="mt-1 font-bold text-2xl">{stats.setCount}</p>
					<p className="text-muted-foreground">Série</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Weight />
					<p className="mt-1 font-bold text-2xl">{totalWeightTons}t</p>
					<p className="text-muted-foreground">Váha</p>
				</div>
				<div className="flex flex-col items-center justify-between gap-1 rounded-2xl bg-secondary py-4 text-center">
					<Repeat />
					<p className="mt-1 font-bold text-2xl">{stats.repCount}</p>
					<p className="text-muted-foreground">Opakovaní</p>
				</div>
			</div>
		</div>
	);
};

export default OverallStats;
