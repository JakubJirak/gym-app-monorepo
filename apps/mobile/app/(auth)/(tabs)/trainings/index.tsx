import Categories from "@/components/trainings/categories";
import SearchBar from "@/components/trainings/search-bar";
import { FlatList, View } from "react-native";
import Training from "@/components/trainings/training";
import { useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Trainings() {

  const workouts = useQuery(api.workouts.getUserWorkouts);
  //console.log(workouts);

	return (
		<View className="flex-1 bg-primary px-4">
			<SearchBar />
			<Categories />
			<FlatList
				data={workouts}
				renderItem={({ item }) => (
					<Training
						id={item._id}
						name={item.name}
						date={item.workoutDate}
						//exercises={item.workoutExercises.length}
						filter={item.filter}
					/>
				)}
				keyExtractor={(item) => item._id}
				ItemSeparatorComponent={() => (
					<View className="w-full h-0.5 bg-secondary" />
				)}
			/>
		</View>
	);
}
