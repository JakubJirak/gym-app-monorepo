import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";

type PowerflitingStatsType = {
	benchPR: number;
	deadliftPR: number;
	squatPR: number;
};

const PowerliftingStats = ({ benchPR, squatPR, deadliftPR }: PowerflitingStatsType) => {
	const { data: weightData } = useSuspenseQuery(convexQuery(api.userWeights.getUserWeight, {}));
	const total = squatPR + deadliftPR + benchPR;

	if (total === 0) {
		return null;
	}

	return (
		<div className="-mt-2 p-2">
			<div className="mb-6">
				<h2 className="mb-1.5 flex items-center gap-3 font-bold text-lg">
					<Trophy />
					Powerlifting PR
				</h2>
				<p className="text-muted-foreground text-sm">
					{weightData ? `${weightData.weight}kg BW` : "Zadejte svoji váhu v profilu"}
				</p>
			</div>
			<div>
				<div className="space-y-4">
					<div className="grid grid-cols-3 gap-1">
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{squatPR}kg</p>
							<p className="mb-1 text-muted-foreground text-sm sm:text-base">Squat</p>
							{weightData ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{(squatPR / Number(weightData.weight)).toFixed(2)}x BW
								</Badge>
							) : null}
						</div>
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{benchPR}kg</p>
							<p className="mb-1 text-center text-muted-foreground text-sm sm:text-base">
								Bench Press
							</p>
							{weightData ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{(benchPR / Number(weightData.weight)).toFixed(2)}x BW
								</Badge>
							) : null}
						</div>
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{deadliftPR}kg</p>
							<p className="mb-1 text-center text-muted-foreground text-sm sm:text-base">
								Deadlift
							</p>
							{weightData ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{(deadliftPR / Number(weightData.weight)).toFixed(2)}x BW
								</Badge>
							) : null}
						</div>
					</div>
					<Separator />
					<div className="">
						<div className="grid gap-5 space-y-2">
							<div className="flex flex-col items-center justify-center gap-1">
								<p className="text-center font-bold text-2xl">{total}kg</p>
								<p className="text-muted-foreground">Total</p>
								{weightData ? (
									<Badge className="text-xs sm:text-base" variant="accent">
										{(total / Number(weightData.weight)).toFixed(2)}x BW
									</Badge>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PowerliftingStats;
