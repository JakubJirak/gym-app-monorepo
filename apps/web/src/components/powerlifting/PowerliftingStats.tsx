import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";

type PowerflitingStatsType = {
	benchPR: number;
	deadliftPR: number;
	squatPR: number;
	weightData:
		| {
				weight: string;
		  }
		| null
		| undefined;
};

const PowerliftingStats = ({ benchPR, squatPR, deadliftPR, weightData }: PowerflitingStatsType) => {
	const total = squatPR + deadliftPR + benchPR;
	const bodyWeight = Number(weightData?.weight);
	const hasBodyWeight = Number.isFinite(bodyWeight) && bodyWeight > 0;

	const formatBodyWeightRatio = (weight: number) =>
		hasBodyWeight ? `${(weight / bodyWeight).toFixed(2)}x BW` : null;

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
					{hasBodyWeight ? `${bodyWeight}kg BW` : "Zadejte svoji váhu v profilu"}
				</p>
			</div>
			<div>
				<div className="space-y-4">
					<div className="grid grid-cols-3 gap-1">
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{squatPR}kg</p>
							<p className="mb-1 text-muted-foreground text-sm sm:text-base">Squat</p>
							{formatBodyWeightRatio(squatPR) ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{formatBodyWeightRatio(squatPR)}
								</Badge>
							) : null}
						</div>
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{benchPR}kg</p>
							<p className="mb-1 text-center text-muted-foreground text-sm sm:text-base">
								Bench Press
							</p>
							{formatBodyWeightRatio(benchPR) ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{formatBodyWeightRatio(benchPR)}
								</Badge>
							) : null}
						</div>
						<div className="flex flex-col items-center justify-center gap-1">
							<p className="font-bold text-lg sm:text-xl">{deadliftPR}kg</p>
							<p className="mb-1 text-center text-muted-foreground text-sm sm:text-base">
								Deadlift
							</p>
							{formatBodyWeightRatio(deadliftPR) ? (
								<Badge className="text-xs sm:text-base" variant="secondary">
									{formatBodyWeightRatio(deadliftPR)}
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
								{formatBodyWeightRatio(total) ? (
									<Badge className="text-xs sm:text-base" variant="accent">
										{formatBodyWeightRatio(total)}
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
