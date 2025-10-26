import { useQuery } from "convex/react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { api } from "../../../../packages/convex/convex/_generated/api";

export default function Categories() {
	//const categories = ["Push", "Pull", "Fullbody", "Upper", "Lower"];
	const categories = useQuery(api.filters.getAllFilters);

	if (!categories || categories === undefined) return null;

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerClassName="gap-2 mb-3"
		>
			{categories.map((category) => (
				<TouchableOpacity
					key={category._id}
					className="text-center flex justify-center items-center px-3 py-1.5 rounded-xl bg-secondary border"
					style={{ borderColor: `${category.color}CC` }}
				>
					<Text className="text-white text-lg">{category.name}</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}
