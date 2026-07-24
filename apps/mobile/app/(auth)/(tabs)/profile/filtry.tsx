import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddFilterModal from "@/components/filters/add-filter";
import EditFilterModal from "@/components/filters/edit-filter";
import Filter from "@/components/filters/filter";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Filtry() {
	const filtry = useQuery(api.filters.getFiltersWithUsage);
	const [selectedFilter, setSelectedFilter] = useState<
		(typeof api.filters.getFiltersWithUsage._returnType)[number] | null
	>(null);

	const openEditFilter = (filter: (typeof api.filters.getFiltersWithUsage._returnType)[number]) => {
		setSelectedFilter(filter);
		requestAnimationFrame(() => TrueSheet.present(NAMES.sheets.editFilter));
	};

	if (filtry === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

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
						name={item.name}
						onPress={() => openEditFilter(item)}
						usageCount={item.usageCount}
					/>
				)}
				showsVerticalScrollIndicator={false}
			/>

			<TouchableOpacity
				className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-3.5"
				onPress={() => TrueSheet.present(NAMES.sheets.addFilter)}
			>
				<Plus color="white" size={32} />
			</TouchableOpacity>
			<AddFilterModal />
			{selectedFilter ? (
				<EditFilterModal
					defaultColor={selectedFilter.color}
					defaultName={selectedFilter.name}
					filterId={selectedFilter._id}
					usageCount={selectedFilter.usageCount}
				/>
			) : null}
		</View>
	);
}
