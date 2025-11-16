import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddFilterModal from "@/components/filters/add-filter";
import Filter from "@/components/filters/filter";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Filtry() {
	const filtry = useQuery(api.filters.getAllFilters);
	const [addFilter, setAddFilter] = useState(false);

	if (!filtry || filtry === undefined) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Filtry" />
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-2"
				onPress={() => setAddFilter(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>
			{/*<View className="mx-2 mt-4 gap-2">
				<View className="flex-row items-center gap-3">
					<TableProperties color="white" size={24} />
					<Text className="font-bold text-text text-xl">Vaše</Text>
					<Text className="-ml-1.5 font-bold text-text text-xl">filtry</Text>
				</View>

				<Text className="text-base text-muted">
					Pomocí filtrů si jednoduše můžete vyhledat určité tréninky!
				</Text>
			</View>*/}
			<FlatList
				className="mx-2 mt-4"
				data={filtry}
				// ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => <Filter color={item.color} id={item._id} name={item.name} />}
			/>
			<AddFilterModal setSheetVisible={setAddFilter} sheetVisible={addFilter} />
		</View>
	);
}
