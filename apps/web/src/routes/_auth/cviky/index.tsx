import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { useMemo } from "react";
import { AddExercise } from "@/components/cviky/AddExercise";
import Exercise from "@/components/cviky/Exercise";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

type ExerciseType = {
	_id: string;
	name: string;
	muscleGroup: string;
};

type SortedExercises = {
	[muscleGroup: string]: ExerciseType[];
};

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
	const { data: exercises } = useSuspenseQuery(convexQuery(api.exercises.getAllExercises, {}));

	const sortedExercises = useMemo<SortedExercises>(
		() =>
			(exercises ?? []).reduce<SortedExercises>((acc, exercise) => {
				if (!acc[exercise.muscleGroup]) {
					acc[exercise.muscleGroup] = [];
				}
				acc[exercise.muscleGroup].push(exercise);
				return acc;
			}, {}),
		[exercises]
	);

	if (exercises === undefined) {
		return (
			<div className="pb-8">
				<Header page="CVIKY" />
				<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8" />
			</div>
		);
	}

	if (!exercises || exercises?.length === 0) {
		return (
			<div className="pb-8">
				<Header page="CVIKY" />
				<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
					<p>Žádné cviky k zobrazení.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pb-8">
			<Header page="CVIKY" />

			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
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

				<Accordion className="w-full" type="multiple">
					{Object.entries(sortedExercises).map(([muscleGroup, ex]) => (
						<AccordionItem key={muscleGroup} value={muscleGroup}>
							<AccordionTrigger className="pt-3 pb-2 font-bold text-base hover:no-underline">
								{muscleGroup}
							</AccordionTrigger>

							<AccordionContent className="pb-2">
								<div className="mt-2 space-y-2">
									{ex.map((exercise) => (
										<Exercise
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
			</div>
		</div>
	);
}
