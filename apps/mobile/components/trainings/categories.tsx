import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function Categories() {
	const categories = ["Push", "Pull", "Fullbody", "Upper", "Lower"];

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ marginBottom: 16, height: 48 }}
		>
			{categories.map((category) => (
				<TouchableOpacity key={category}>
					<Text className="text-white bg-secondary text-lg flex items-ceter justify-center mx-2 py-2 px-3.5 rounded-xl">
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}
