import Header from "@/components/Header.tsx";
import UserAccInfo from "@/components/profil/UserAccInfo";
import { Button } from "@/components/ui/button";
//import UserAccInfo from "@/components/profil/UserAccInfo.tsx";
//import UserSetGoals from "@/components/profil/UserSetGoals.tsx";
//import UserWeightInput from "@/components/profil/UserWeightInput.tsx";
//import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

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

  return (
    <>
      <Header page="PROFIL" />
      <div className="max-w-[500px] w-[90%] mx-auto space-y-4 pb-8">
        <UserAccInfo />
        {/*<Separator />
        <UserWeightInput />
        <Separator />
        <UserSetGoals />*/}
        <Button onClick={handleClick}>add workout</Button>
        <Button onClick={handleFetch}>fetch workout</Button>
      </div>
    </>
  );
}
