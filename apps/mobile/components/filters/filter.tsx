import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Pencil } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { NAMES } from "@/constants/NAMES";
import EditFilterModal from "./edit-filter";

export default function Filter({
	name,
	color,
	id,
	usageCount,
}: {
	name: string;
	color: string;
	id: string;
	usageCount: number;
}) {
	const editFilterSheetName = `${NAMES.sheets.editFilter}-${id}`;

	return (
		<TouchableOpacity activeOpacity={0.7} onPress={() => TrueSheet.present(editFilterSheetName)}>
			<View className="my-1.5 flex-row items-center gap-4 rounded-xl bg-secondary px-3">
				<View
					style={{
						backgroundColor: color,
						height: 16,
						width: 16,
						borderRadius: 100,
						marginLeft: 4,
					}}
				/>
				<Text className="flex-1 text-lg text-text">{name}</Text>
				<Text className="text-base text-muted">{usageCount}x</Text>
				<View className="ml-2 rounded-full bg-secondary px-1 py-3.5">
					<Pencil color="white" size={18} />
				</View>
				<EditFilterModal
					defaultColor={color}
					defaultName={name}
					filterId={id}
					sheetName={editFilterSheetName}
					usageCount={usageCount}
				/>
			</View>
		</TouchableOpacity>
	);
}
