import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { AddExercise } from "@/components/cviky/AddExercise";
import Exercise from "@/components/cviky/Exercise";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/cviky/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Cviky | GYM APPLICATION" },
			{
				name: "description",
				content: "Seznam všech základních a vlastních cviků uživatele",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="pb-8">
			<Header page="CVIKY" />

			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">
				<div className="mb-4 flex items-center justify-between pl-1">
					<div className="">
						<h2 className="mb-1 flex items-center gap-2 font-semibold text-lg">
							<Dumbbell size={20} />
							Vaše cviky
						</h2>
						<p className="text-muted-foreground text-sm">Zde jsou všechny vaše cviky</p>
					</div>

					<AddExercise defaultName="" />
				</div>

				<Suspense fallback={<ExercisesLoading />}>
					<ExerciseGroups />
				</Suspense>
			</div>
		</div>
	);
}

function ExerciseGroups() {
	const { data: exerciseGroups } = useSuspenseQuery(convexQuery(api.exercises.getExerciseGroups, {}));

	if (exerciseGroups.length === 0) {
		return <p>Žádné cviky k zobrazení.</p>;
	}

	return (
		<Accordion className="w-full" type="multiple">
			{exerciseGroups.map((group) => (
				<AccordionItem key={group._id} value={group._id}>
					<AccordionTrigger className="pt-3 pb-2 font-bold text-base hover:no-underline">
						{group.name}
					</AccordionTrigger>

					<AccordionContent className="pb-2">
						<div className="mt-2 space-y-2">
							{group.exercises.map((exercise) => (
								<Exercise
									editable={exercise.editable}
									id={exercise._id}
									key={exercise._id}
									name={exercise.name}
								/>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

function ExercisesLoading() {
	return (
		<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
			<LoaderCircle className="animate-spin" />
			<span>Načítám cviky…</span>
		</div>
	);
}
