import { useQuery } from "convex/react";
import { FlatList, View } from "react-native";
import Categories from "@/components/trainings/categories";
import SearchBar from "@/components/trainings/search-bar";
import Training from "@/components/trainings/training";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Trainings() {
	const workouts = useQuery(api.workouts.getUserWorkouts);

	return (
		<View className="flex-1 bg-primary px-4">
			<SearchBar />
			<Categories />
			<FlatList
				data={workouts}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<Training
						date={item.workoutDate}
						filter={item.filter}
						id={item._id}
						//exercises={item.workoutExercises.length}
						name={item.name}
					/>
				)}
			/>
		</View>
	);
}
