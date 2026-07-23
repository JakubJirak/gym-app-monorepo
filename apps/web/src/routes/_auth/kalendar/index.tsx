import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { cs } from "date-fns/locale";
import { LoaderCircle } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import Header from "@/components/Header.tsx";
import { TrainingSummaryLink } from "@/components/treninky/training-summary-link.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { toLocalISODateString } from "../../../../utils/date-utils";

export const Route = createFileRoute("/_auth/kalendar/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Kalendář | GYM APPLICATION" },
			{ name: "description", content: "Kalendář s dny tréninků" },
		],
	}),
});

function RouteComponent() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const { data: trainings, isError, isPending } = useQuery(convexQuery(api.workouts.getUserWorkoutSummaries, {}));
	const selectedDate = toLocalISODateString(date);
	const matchingTrainings = useMemo(
		() => trainings?.filter((training) => training.workoutDate === selectedDate) ?? [],
		[trainings, selectedDate]
	);
	const trainingDates = useMemo(
		() => trainings?.map((training) => new Date(`${training.workoutDate}T00:00:00`)) ?? [],
		[trainings]
	);

	let content: ReactNode;
	if (isPending) {
		content = (
			<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
				<LoaderCircle className="h-5 w-5 animate-spin" />
				<span>Načítám kalendář…</span>
			</div>
		);
	} else if (isError || !trainings) {
		content = <p className="py-10 text-center text-muted-foreground">Kalendář se nepodařilo načíst.</p>;
	} else {
		content = (
			<>
				<Calendar
					className="w-full rounded-2xl border border-border"
					defaultMonth={date}
					locale={cs}
					mode="single"
					modifiers={{ hasTraining: trainingDates }}
					modifiersClassNames={{
						hasTraining:
							"[&>button]:rounded-lg [&>button]:bg-ring/70 [&>button]:font-bold [&>button]:text-white",
					}}
					onSelect={(selected) => selected && setDate(selected)}
					selected={date}
				/>

				<div>
					{matchingTrainings.length > 0 ? (
						matchingTrainings.map((training, index) => (
							<div key={training._id}>
								<TrainingSummaryLink training={training} />
								{index < matchingTrainings.length - 1 && <Separator />}
							</div>
						))
					) : (
						<p className="py-6 text-center text-muted-foreground text-sm">
							V tento den nemáte žádný trénink.
						</p>
					)}
				</div>
			</>
		);
	}

	return (
		<div>
			<Header page="KALENDÁŘ" />

			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">{content}</div>
		</div>
	);
}
