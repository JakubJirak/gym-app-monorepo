import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EditFilterModal from "./edit-filter";

export default function Filter({ name, color, id }: { name: string; color: string; id: string }) {
	const [edit, setEdit] = useState(false);

	return (
		<View className="my-2 flex-row items-center gap-4 rounded-xl bg-secondary px-3">
			<View style={{ backgroundColor: color, height: 16, width: 16, borderRadius: 100, marginLeft: 4 }} />
			<Text className="flex-1 text-lg text-text">{name}</Text>
			<TouchableOpacity
				className="ml-2 rounded-full bg-secondary px-1 py-3.5"
				onPress={() => setEdit(true)}
			>
				<Pencil color="white" size={18} />
			</TouchableOpacity>
			<EditFilterModal
				defaultColor={color}
				defaultName={name}
				filterId={id}
				setSheetVisible={setEdit}
				sheetVisible={edit}
			/>
		</View>
	);
}
