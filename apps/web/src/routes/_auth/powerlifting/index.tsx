import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import Header from "@/components/Header.tsx";
import PowerliftingGoals from "@/components/powerlifting/PowerliftingGoals.tsx";
import PowerliftingStats from "@/components/powerlifting/PowerliftingStats.tsx";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/powerlifting/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Powerlifting | GYM APPLICATION" },
			{ name: "description", content: "Powerlifting statistiky uživatele." },
		],
	}),
});

function RouteComponent() {
	const { data: stats, isError, isPending } = useQuery(convexQuery(api.powerlifting.getPowerliftingStats, {}));
	const { data: weightData } = useQuery(convexQuery(api.userWeights.getUserWeight, {}));
	const { data: goals } = useQuery(convexQuery(api.userGoals.getUserGoals, {}));

	let content: ReactNode;
	if (isPending) {
		content = (
			<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
				<LoaderCircle className="h-5 w-5 animate-spin" />
				<span>Načítám powerlifting statistiky…</span>
			</div>
		);
	} else if (isError || !stats) {
		content = (
			<p className="py-10 text-center text-muted-foreground">
				Powerlifting statistiky se nepodařilo načíst.
			</p>
		);
	} else {
		content = (
			<>
				<PowerliftingStats
					benchPR={stats.benchPR}
					deadliftPR={stats.deadliftPR}
					squatPR={stats.squatPR}
					weightData={weightData}
				/>
				<Separator />
				<PowerliftingGoals
					benchPR={stats.benchPR}
					deadliftPR={stats.deadliftPR}
					goals={goals}
					squatPR={stats.squatPR}
				/>
			</>
		);
	}

	return (
		<>
			<Header page="POWERLIFTING" />
			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">{content}</div>
		</>
	);
}
