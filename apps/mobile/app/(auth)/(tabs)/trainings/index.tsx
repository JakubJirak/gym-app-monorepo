import { usePaginatedQuery, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import Categories from "@/components/trainings/categories";
import EmptyList from "@/components/trainings/empty-list";
import Training from "@/components/trainings/training";
import TrainingActions, { type ActionWorkout } from "@/components/trainings/training-actions";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

export default function Trainings() {
	const [selectedFilterId, setSelectedFilterId] = useState<string | undefined>(undefined);
	const [selectedWorkout, setSelectedWorkout] = useState<ActionWorkout | null>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const categories = useQuery(api.filters.getFilterSummaries);
	const { results, status, loadMore } = usePaginatedQuery(
		api.workouts.getUserWorkoutPage,
		selectedFilterId ? { filterId: selectedFilterId as Id<"filters"> } : {},
		{ initialNumItems: 20 }
	);

	const categoriesById = useMemo(
		() => new Map(categories?.map((category) => [category._id, category]) ?? []),
		[categories]
	);

	const closeMenu = useCallback(() => setMenuVisible(false), []);

	if (categories === undefined || status === "LoadingFirstPage") {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

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
				data={results}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				initialNumToRender={10}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => <EmptyList />}
				ListFooterComponent={
					status === "LoadingMore" ? (
						<View className="items-center py-5">
							<ActivityIndicator color={COLORS.accent} />
						</View>
					) : null
				}
				maxToRenderPerBatch={10}
				onEndReached={() => {
					if (status === "CanLoadMore") {
						loadMore(20);
					}
				}}
				onEndReachedThreshold={0.4}
				renderItem={({ item }) => {
					const filter = categoriesById.get(item.filterId) ?? null;

					return (
						<Training
							date={item.workoutDate}
							filter={filter}
							id={item._id}
							note={item.name}
							onLongPress={(position) => {
								setSelectedWorkout(item);
								setMenuPosition(position);
								setMenuVisible(true);
							}}
						/>
					);
				}}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				windowSize={7}
			/>

			<TrainingActions
				menuPosition={menuPosition}
				menuVisible={menuVisible}
				onClose={closeMenu}
				workout={selectedWorkout}
			/>
		</View>
	);
}
