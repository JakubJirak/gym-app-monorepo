import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddFilterModal from "@/components/filters/add-filter";
import Filter from "@/components/filters/filter";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Filtry() {
	const filtry = useQuery(api.filters.getAllFilters);
	const workouts = useQuery(api.workouts.getUserWorkouts);
	const [addFilter, setAddFilter] = useState(false);

	if (filtry === undefined || workouts === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (filtry === null || workouts === null) {
		return null;
	}

	const filterUsageCount = workouts.reduce<Record<string, number>>((acc, workout) => {
		if (workout.filter?._id) {
			acc[workout.filter._id] = (acc[workout.filter._id] || 0) + 1;
		}
		return acc;
	}, {});

	return (
		<View className="flex-1 bg-primary">
			<FlatList
				className="flex-1 px-2"
				contentContainerClassName="mx-2"
				data={filtry}
				keyExtractor={(item) => item._id}
				ListHeaderComponent={
					<View className="mb-4">
						<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Kategorie" />
					</View>
				}
				renderItem={({ item }) => (
					<Filter
						color={item.color}
						id={item._id}
						name={item.name}
						usageCount={filterUsageCount[item._id] || 0}
					/>
				)}
				showsVerticalScrollIndicator={false}
			/>

			<TouchableOpacity
				className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-2"
				onPress={() => setAddFilter(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>
			<AddFilterModal setSheetVisible={setAddFilter} sheetVisible={addFilter} />
		</View>
	);
}
