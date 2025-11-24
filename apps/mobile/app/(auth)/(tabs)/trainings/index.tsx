import { useQuery } from "convex/react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Categories from "@/components/trainings/categories";
import Training from "@/components/trainings/training";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Trainings() {
	const workouts = useQuery(api.workouts.getUserWorkouts);

	if (workouts === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1 bg-primary px-4">
			{/* <SearchBar /> */}
			<Categories />
			<FlatList
				data={workouts}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<View className="items-center justify-center py-8">
						<Text className="text-base text-muted">Žádné tréninky k zobrazení</Text>
					</View>
				)}
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
