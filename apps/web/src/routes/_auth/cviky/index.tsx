import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../../../../../packages/convex/convex/_generated/api'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import { Dumbbell } from 'lucide-react';
import { useMemo } from 'react';
import { AddExercise } from '@/components/cviky/AddExercise';
import { Id } from '../../../../../../packages/convex/convex/_generated/dataModel';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';

type Exercise = {
  _id: string;
  name: string;
  muscleGroup: string;
};

type SortedExercises = {
  [muscleGroup: string]: Exercise[];
};

export const Route = createFileRoute('/_auth/cviky/')({
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
})

function RouteComponent() {

  const { data: exercises } = useSuspenseQuery(convexQuery(api.exercises.getAllExercises, {}));
  const addExercise = useMutation(api.exercises.addExercise);

  const sortedExercises = useMemo<SortedExercises>(() => {
      return (exercises ?? []).reduce<SortedExercises>((acc, exercise) => {
        if (!acc[exercise.muscleGroup]) acc[exercise.muscleGroup] = [];
        acc[exercise.muscleGroup].push(exercise);
        return acc;
      }, {});
    }, [exercises]);

  const handleAddExercise = (exerciseName: string, muscleGroupId: Id<"muscleGroups">) => {
    addExercise({
      name: exerciseName,
      muscleGroupId,
    })
  }


  if (exercises === undefined) {
      return (
        <div className="pb-8">
          <Header page="CVIKY" />
          <div className="max-w-[500px] mx-auto w-[90%] space-y-4 pb-8"/>
        </div>
      );
    }

  if (!exercises || exercises?.length === 0) {
      return (
        <div className="pb-8">
          <Header page="CVIKY" />
          <div className="max-w-[500px] mx-auto w-[90%] space-y-4 pb-8">
            <p>Žádné cviky k zobrazení.</p>
          </div>
        </div>
      );
    }

  return (
    <div className="pb-8">
      <Header page="CVIKY" />

      <div className="max-w-[500px] mx-auto w-[90%] space-y-4 pb-8">
        <div className="flex justify-between items-center mb-4 pl-1">
          <div className="">
            <h2 className="font-semibold text-lg flex gap-2 items-center mb-1">
              <Dumbbell size={20} />
              Vaše cviky
            </h2>
            <p className="text-muted-foreground text-sm">
              Zde jsou všechny vaše cviky
            </p>
          </div>

          <AddExercise handleAddExercise={handleAddExercise} defaultName="" />
        </div>

        <Accordion
          type="multiple"
          className="w-full"
        >
          {Object.entries(sortedExercises).map(([muscleGroup, exercises]) => (
            <AccordionItem key={muscleGroup} value={muscleGroup}>

              <AccordionTrigger className="text-base font-bold pb-2 pt-3 hover:no-underline">
                {muscleGroup}
              </AccordionTrigger>

              <AccordionContent className="pb-2">
                <div className="pl-2 mt-2 space-y-2">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise._id}
                      className="my-1 rounded-xl text-base flex justify-between items-center"
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
