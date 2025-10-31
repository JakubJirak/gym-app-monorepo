import { useQuery } from "convex/react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";

export default function Categories() {
	//const categories = ["Push", "Pull", "Fullbody", "Upper", "Lower"];
	const categories = useQuery(api.filters.getAllFilters);

	if (!categories || categories === undefined) {
		return null;
	}

	return (
		<ScrollView contentContainerClassName="gap-2 mb-3" horizontal showsHorizontalScrollIndicator={false}>
			{categories.map((category) => (
				<TouchableOpacity
					className="flex items-center justify-center rounded-xl border bg-secondary px-3 py-1.5 text-center"
					key={category._id}
					style={{ borderColor: `${category.color}CC` }}
				>
					<Text className="text-lg text-white">{category.name}</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}
