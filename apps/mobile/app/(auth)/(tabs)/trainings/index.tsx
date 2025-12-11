import { useQuery } from "convex/react";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import Categories from "@/components/trainings/categories";
import EmptyList from "@/components/trainings/empty-list";
import Training from "@/components/trainings/training";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Trainings() {
	const workouts = useQuery(api.workouts.getUserWorkouts);
	const categories = useQuery(api.filters.getAllFilters);
	const [selectedFilterId, setSelectedFilterId] = useState<string | undefined>(undefined);

	if (workouts === undefined || categories === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	const filteredWorkouts =
		selectedFilterId && workouts
			? workouts.filter((workout) => workout.filter?._id === selectedFilterId)
			: (workouts ?? []);

	return (
		<View className="flex-1 bg-primary">
			<View className="px-4">
				<Categories
					categories={categories}
					selectedFilterId={selectedFilterId}
					setSelectedFilterId={setSelectedFilterId}
				/>
			</View>
			<FlatList
				className="px-4"
				data={filteredWorkouts}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => <EmptyList />}
				renderItem={({ item }) => (
					<Training date={item.workoutDate} filter={item.filter} id={item._id} note={item.name} />
				)}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
