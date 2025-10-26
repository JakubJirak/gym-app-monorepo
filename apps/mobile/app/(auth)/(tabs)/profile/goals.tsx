import { View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import UserGoals from "@/components/goals/user-goals";
import PowerliftingStats from "@/components/goals/powerlifting-stats";

export default function Goals() {
  const trainings = useQuery(api.workouts.getUserWorkouts);

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

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Váhy a cíle" />
			<PowerliftingStats squatPR={squatPR} benchPR={benchPR} deadliftPR={deadliftPR} />
      <UserGoals squatPR={squatPR} benchPR={benchPR} deadliftPR={deadliftPR}/>
		</View>
	);
}
