import Header from "@/components/Header.tsx";
import UserAccInfo from "@/components/profil/UserAccInfo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";
import UserWeightInput from "@/components/profil/UserWeightInput";
import UserSetGoals from "@/components/profil/UserSetGoals";


export const Route = createFileRoute("/_auth/profil/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Profil | GYM APPLICATION" },
      { name: "description", content: "Informace o profilu uživatele" },
    ],
  }),
});

function RouteComponent() {

  const addWorkout = useMutation(api.workouts.addWorkout);
  const workouts = useQuery(api.workouts.getUserWorkouts);
  const addWorkoutBig = useMutation(api.workouts.createWorkout);
  //const identity = useQuery(api.auth.getCurrentUser);

    const handleClick = async () => {
      await addWorkout({
        userId: "m57b50z3j7j0zpj1kstcsm310x7s97zn",
        name: "testovaci",
        workoutDate: "2025-01-01",
        filterId: "kd700d63ameaft56cawm883qfs7sfr30" as Id<"filters">,
      });
      alert("Workout byl přidán!");
    };

    const handleFetch = async () => {
      console.log(workouts);
    }

    const handleAdd = async () => {
      addWorkoutBig({
        name: "testTrenink",
        workoutDate: "2025-01-01",
        filterId: "kd76sgzed4j59em9321n379e397sfrc2" as Id<"filters">,
        exercises: [
          {
            exerciseId: "k97730c7se6ze6w9ydy9384f2s7sezwz" as Id<"exercises">,
            order: 0,
            note: "dobrej row",
            sets: [
              { reps: 10, weight: 50, order: 0 },
              { reps: 8, weight: 60, order: 1 },
              { reps: 6, weight: 70, order: 2 }
            ]
          },
          {
            exerciseId: "k973yjvnvska6kwwxjzq0m2v097sesye" as Id<"exercises">,
            order: 1,
            sets: [
              { reps: 10, weight: 50, order: 0 },
              { reps: 8, weight: 60, order: 1 },
            ]
          }
        ]
      })
    }

  return (
    <>
      <Header page="PROFIL" />
      <div className="max-w-[500px] w-[90%] mx-auto space-y-4 pb-8">
        <UserAccInfo />
        <Separator />
        <UserWeightInput />
        <Separator />
        <UserSetGoals />
        <Button onClick={handleClick}>add workout</Button>
        <Button onClick={handleFetch}>fetch workout</Button>
        <Button onClick={handleAdd}>add big workout</Button>
      </div>
    </>
  );
}
