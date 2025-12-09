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
		<View className="flex-1 bg-primary px-2">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Kategorie" />
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-2"
				onPress={() => setAddFilter(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>
			<FlatList
				className="mx-2 mt-4"
				data={filtry}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<Filter
						color={item.color}
						id={item._id}
						name={item.name}
						usageCount={filterUsageCount[item._id] || 0}
					/>
				)}
				showsHorizontalScrollIndicator={false}
			/>
			<AddFilterModal setSheetVisible={setAddFilter} sheetVisible={addFilter} />
		</View>
	);
}
