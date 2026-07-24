import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import AddRoutine from "@/components/routine/add-routine";
import Routine from "@/components/routine/routine";
import RoutineActions, { type ActionRoutine } from "@/components/routine/routine-actions";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Rutiny() {
	const rutiny = useQuery(api.routines.getMobileRoutineSummaries);
	const [selectedRoutine, setSelectedRoutine] = useState<ActionRoutine | null>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	const openAddRutinaModal = () => {
		TrueSheet.present(NAMES.sheets.addRoutine);
	};

	if (rutiny === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!rutiny) {
		return null;
	}

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
						filterName={item.filter?.name}
						id={item._id}
						name={item.name}
						onLongPress={(position) => {
							setSelectedRoutine(item);
							setMenuPosition(position);
							setMenuVisible(true);
						}}
					/>
				)}
			/>

			<TouchableOpacity
				className="absolute right-8 bottom-8 z-50 rounded-full bg-accent p-3.5"
				onPress={openAddRutinaModal}
			>
				<Plus color="white" size={32} />
			</TouchableOpacity>

			<AddRoutine />
			<RoutineActions
				menuPosition={menuPosition}
				menuVisible={menuVisible}
				onClose={() => setMenuVisible(false)}
				routine={selectedRoutine}
			/>
		</View>
	);
}
