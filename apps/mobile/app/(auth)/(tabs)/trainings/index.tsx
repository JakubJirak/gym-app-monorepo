import Categories from "@/components/trainings/categories";
import SearchBar from "@/components/trainings/search-bar";
import { FlatList, View } from "react-native";
import Training from "@/components/trainings/training";
import { trainings } from "@/constants/trainings";

export default function Trainings() {
	return (
		<View className="flex-1 bg-primary px-4">
			<SearchBar />
			<Categories />
			<FlatList
				data={trainings}
				renderItem={({ item }) => (
					<Training
						id={item.id}
						name={item.name}
						date={item.workoutDate}
						//exercises={item.workoutExercises.length}
						filter={item.filter}
					/>
				)}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => (
					<View className="w-full h-0.5 bg-secondary" />
				)}
			/>
		</View>
	);
}
