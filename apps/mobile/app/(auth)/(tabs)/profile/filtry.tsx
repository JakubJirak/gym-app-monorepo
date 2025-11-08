import { useQuery } from "convex/react";
import { TableProperties } from "lucide-react-native";
import { FlatList, Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import Filter from "@/components/filters/filter";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Filtry() {
	const filtry = useQuery(api.filters.getAllFilters);

	if (!filtry || filtry === undefined) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Filtry" />
			<View className="mx-2 mt-4 gap-2">
				<View className="flex-row items-center gap-3">
					<TableProperties color="white" size={24} />
					<Text className="font-bold text-white text-xl">Vaše</Text>
					<Text className="-ml-1.5 font-bold text-white text-xl">filtry</Text>
				</View>

				<Text className="text-base text-muted">
					Pomocí filtrů si jednoduše můžete vyhledat určité tréninky!
				</Text>
			</View>
			<FlatList
				className="mx-2 mt-4"
				data={filtry}
				// ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => <Filter color={item.color} name={item.name} />}
			/>
		</View>
	);
}
