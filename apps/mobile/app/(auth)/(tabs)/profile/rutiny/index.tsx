import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddRoutine from "@/components/routine/add-routine";
import Routine from "@/components/routine/routine";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Rutiny() {
	const [addRutinaVisible, setAddRutinaVisible] = useState(false);
	const rutiny = useQuery(api.routines.getUserRoutines);

	return (
		<View className="flex-1 bg-primary">
			<FlatList
				className="flex-1 px-4"
				data={rutiny}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<View className="mx-auto mt-10">
						<Text className="text-center text-base text-muted">Zatím nemáte žádné rutiny</Text>
					</View>
				)}
				ListHeaderComponent={<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Rutiny" />}
				renderItem={({ item }) => (
					<Routine
						color={item.filter?.color}
						filterId={item.filterId}
						filterName={item.filter?.name}
						id={item._id}
						name={item.name}
					/>
				)}
			/>

			<TouchableOpacity
				className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-2"
				onPress={() => setAddRutinaVisible(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>

			<AddRoutine setSheetVisible={setAddRutinaVisible} sheetVisible={addRutinaVisible} />
		</View>
	);
}
