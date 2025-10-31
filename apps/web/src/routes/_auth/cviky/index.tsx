import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Dumbbell } from "lucide-react";
import { useMemo } from "react";
import { AddExercise } from "@/components/cviky/AddExercise";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type Exercise = {
	_id: string;
	name: string;
	muscleGroup: string;
};

type SortedExercises = {
	[muscleGroup: string]: Exercise[];
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
	const addExercise = useMutation(api.exercises.addExercise);

	const sortedExercises = useMemo<SortedExercises>(
		() =>
			(exercises ?? []).reduce<SortedExercises>((acc, exercise) => {
				if (!acc[exercise.muscleGroup]) acc[exercise.muscleGroup] = [];
				acc[exercise.muscleGroup].push(exercise);
				return acc;
			}, {}),
		[exercises]
	);

	const handleAddExercise = (exerciseName: string, muscleGroupId: Id<"muscleGroups">) => {
		addExercise({
			name: exerciseName,
			muscleGroupId,
		});
	};

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

					<AddExercise defaultName="" handleAddExercise={handleAddExercise} />
				</div>

				<Accordion className="w-full" type="multiple">
					{Object.entries(sortedExercises).map(([muscleGroup, exercises]) => (
						<AccordionItem key={muscleGroup} value={muscleGroup}>
							<AccordionTrigger className="pt-3 pb-2 font-bold text-base hover:no-underline">
								{muscleGroup}
							</AccordionTrigger>

							<AccordionContent className="pb-2">
								<div className="mt-2 space-y-2 pl-2">
									{exercises.map((exercise) => (
										<div
											className="my-1 flex items-center justify-between rounded-xl text-base"
											key={exercise._id}
										>
											<p>{exercise.name}</p>
										</div>
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
