import Header from "@/components/Header.tsx";
import PowerliftingGoals from "@/components/powerlifting/PowerliftingGoals.tsx";
import PowerliftingStats from "@/components/powerlifting/PowerliftingStats.tsx";
import { Separator } from "@/components/ui/separator";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/powerlifting/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Powerlifting| GYM APPLICATION" },
			{ name: "description", content: "Powerlifting statistiky uživatele." },
		],
	}),
});

function RouteComponent() {
	const { data: trainings, isLoading } = useSuspenseQuery(
		convexQuery(api.workouts.getUserWorkouts, {}),
	);

	const getSetsById = (id: string): number[] | undefined => {
		if (trainings !== undefined) {
			return trainings
				?.flatMap((training) => training.exercises)
				.filter((exercise) => exercise.exercise && exercise.exercise._id === id)
				.flatMap((exercise) => exercise.sets)
				.map((set) => Number(set.weight));
		}
		return [];
	};

	const maxWeight = (arr: number[]): number => {
		if (arr.length === 0) return 0;
		return Math.max(...arr);
	};

	const squatPR = maxWeight(
		getSetsById("k97fsv5mktmwx3a85nc3yf92e97sftej") ?? [],
	);
	const benchPR = maxWeight(
		getSetsById("k978awwr2wv1edjy57tmb1ncex7serqt") ?? [],
	);
	const deadliftPR = maxWeight(
		getSetsById("k971nc4hm5cfvk9rqxs86j1zqh7se6zv") ?? [],
	);

	if (isLoading) return <Header page="POWERLIFTING" />;

	return (
		<>
			<Header page="POWERLIFTING" />
			<div className="max-w-[500px] w-[90%] mx-auto space-y-4 pb-8">
				<PowerliftingStats
					benchPR={benchPR}
					deadliftPR={deadliftPR}
					squatPR={squatPR}
				/>
				<Separator />
				<PowerliftingGoals
					benchPR={benchPR}
					deadliftPR={deadliftPR}
					squatPR={squatPR}
				/>
			</div>
		</>
	);
}
