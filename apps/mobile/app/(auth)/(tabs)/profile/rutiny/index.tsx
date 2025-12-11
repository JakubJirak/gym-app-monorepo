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
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile" text="Rutiny" />
			<TouchableOpacity
				className="absolute right-8 bottom-8 z-100 rounded-full bg-accent p-2"
				onPress={() => setAddRutinaVisible(true)}
			>
				<Plus color="white" size={44} />
			</TouchableOpacity>

			<FlatList
				data={rutiny}
				ItemSeparatorComponent={() => <View className="h-0.5 w-full bg-secondary" />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<View className="mx-auto mt-10">
						<Text className="text-center text-base text-muted">Zatím nemáte žádné rutiny</Text>
					</View>
				)}
				renderItem={({ item }) => (
					<Routine
						color={item.filter?.color}
						filterName={item.filter?.name}
						id={item._id}
						name={item.name}
					/>
				)}
			/>

			<AddRoutine setSheetVisible={setAddRutinaVisible} sheetVisible={addRutinaVisible} />
		</View>
	);
}
