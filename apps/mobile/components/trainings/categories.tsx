import { ScrollView, Text, TouchableOpacity } from "react-native";
import type { api } from "../../../../packages/convex/convex/_generated/api";

type CategoriesProps = {
	selectedFilterId: string | undefined;
	setSelectedFilterId: (id: string | undefined) => void;
	categories: typeof api.filters.getAllFilters._returnType;
};

export default function Categories({ selectedFilterId, setSelectedFilterId, categories }: CategoriesProps) {
	if (!categories || categories === undefined) {
		return null;
	}

	const handlePress = (filterId: string) => {
		if (selectedFilterId === filterId) {
			setSelectedFilterId(undefined);
		} else {
			setSelectedFilterId(filterId);
		}
	};

	return (
		<ScrollView
			contentContainerClassName="gap-2 h-13 mt-3  pb-3 mb-3"
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			{categories.map((category) => {
				const isSelected = selectedFilterId === category._id;
				return (
					<TouchableOpacity
						className="flex items-center justify-center rounded-full border px-3 py-1.5 text-center"
						key={category._id}
						onPress={() => handlePress(category._id)}
						style={{
							borderColor: `${category.color}CC`,
							backgroundColor: isSelected ? `${category.color}33` : "#0f0f0f",
						}}
					>
						<Text className="text-base text-text">{category.name}</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
}
