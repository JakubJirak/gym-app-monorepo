import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { NotebookPen } from "lucide-react";
import { useState } from "react";
import { toLocalISODateString } from "utils/date-utils";
import CalendarTrainingLi from "@/components/calendar/CalendarTrainingLi";
import Header from "@/components/Header.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar.tsx";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

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
	const { data: trainings } = useSuspenseQuery(convexQuery(api.workouts.getUserWorkouts, {}));

	function allDates() {
		return trainings?.map((training) => training.workoutDate);
	}

	const matchingTrainings = trainings?.filter((training) => training.workoutDate === toLocalISODateString(date));

	function formatDate(d: Date | null, formatString: string) {
		if (d) {
			return format(d, formatString, { locale: cs });
		}
		return "neplatne datum";
	}

	return (
		<div className="">
			<Header page="KALENDÁŘ" />

			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<div className="">
					<Calendar
						className="w-full rounded-2xl border border-border"
						components={{
							// biome-ignore lint/correctness/noNestedComponentDefinitions: faster
							DayButton: ({ children, modifiers, day, ...props }) => {
								const trainingsDates = allDates();
								const dayString = toLocalISODateString(day.date);
								const isSpecial = trainingsDates?.includes(dayString);

								return (
									<CalendarDayButton
										day={day}
										modifiers={modifiers}
										{...props}
										className={
											isSpecial
												? "rounded-lg bg-ring/70 font-bold text-white"
												: ""
										}
									>
										{children}
									</CalendarDayButton>
								);
							},
						}}
						defaultMonth={date}
						locale={cs}
						mode="single"
						onSelect={(d) => d && setDate(d)}
						selected={date}
					/>
				</div>
				<div className="">
					<Accordion className="w-full space-y-2" type="multiple">
						{matchingTrainings?.map((training) => (
							<AccordionItem
								className="rounded-xl border bg-background px-4 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
								key={training._id}
								value={training._id}
							>
								<AccordionTrigger className="flex items-center gap-2 py-3 hover:no-underline">
									<Link
										className="flex flex-1 flex-row items-center gap-y-1"
										params={{ trainingId: training._id }}
										to={"/treninky/$trainingId"}
									>
										<div className="flex flex-1 flex-col gap-1">
											<div className="font-semibold text-base">
												{formatDate(
													new Date(training.workoutDate),
													"PPPP"
												)}
											</div>
											{training.name && (
												<div className="flex items-center gap-2 text-muted-foreground text-sm">
													<NotebookPen className="h-4 w-4" />
													{training.name}
												</div>
											)}
										</div>

										<div
											className="rounded-full border px-3 py-1 text-center"
											style={{
												borderColor: training?.filter?.color
													? `${training.filter.color}99`
													: "hsl(var(--border))",
												color:
													training?.filter?.color ||
													"hsl(var(--foreground))",
											}}
										>
											{training?.filter?.name || "Žádný"}
										</div>
									</Link>
								</AccordionTrigger>

								<AccordionContent className="pb-4">
									<div className="relative flex flex-col items-stretch gap-2">
										{training.exercises.map((exercise, index) => (
											<CalendarTrainingLi
												exercise={exercise}
												index={index}
												key={exercise._id}
												len={training.exercises.length}
											/>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</div>
	);
}
