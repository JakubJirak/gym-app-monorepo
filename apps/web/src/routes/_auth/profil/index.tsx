import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header.tsx";
import UserAccInfo from "@/components/profil/UserAccInfo";
import UserSetGoals from "@/components/profil/UserSetGoals";
import UserWeightInput from "@/components/profil/UserWeightInput";
import UserDescription from "@/components/profil/userDescription";
import { Separator } from "@/components/ui/separator";

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
	//const addWorkoutBig = useMutation(api.workouts.createWorkout);
	//const identity = useQuery(api.auth.getCurrentUser);

	// const handleAdd = async () => {
	//   addWorkoutBig({
	//     name: "testTrenink",
	//     workoutDate: "2025-01-01",
	//     filterId: "kd76sgzed4j59em9321n379e397sfrc2" as Id<"filters">,
	//     exercises: [
	//       {
	//         exerciseId: "k97730c7se6ze6w9ydy9384f2s7sezwz" as Id<"exercises">,
	//         order: 0,
	//         note: "dobrej row",
	//         sets: [
	//           { reps: 10, weight: 50, order: 0 },
	//           { reps: 8, weight: 60, order: 1 },
	//           { reps: 6, weight: 70, order: 2 }
	//         ]
	//       },
	//       {
	//         exerciseId: "k973yjvnvska6kwwxjzq0m2v097sesye" as Id<"exercises">,
	//         order: 1,
	//         sets: [
	//           { reps: 10, weight: 50, order: 0 },
	//           { reps: 8, weight: 60, order: 1 },
	//         ]
	//       }
	//     ]
	//   })
	// }

	return (
		<>
			<Header page="PROFIL" />
			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<Separator />
				<UserAccInfo />
				<Separator />
				<UserDescription />
				<Separator />
				<UserWeightInput />
				<Separator />
				<UserSetGoals />
			</div>
		</>
	);
}
