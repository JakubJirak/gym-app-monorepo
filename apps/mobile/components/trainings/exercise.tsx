import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import EditMenuModal from "./modals/edit-menu";
import ExerciseSet from "./set";

type ExerciseProps = {
	_id: string;
	name: string;
	muscleGroup: string | null;
	note: string | undefined;
	isEdit: boolean;
	sets:
		| {
				_id: string;
				reps: number;
				weight: number;
				order: number;
		  }[]
		| null;
};

export default function Exercise({ _id, name, muscleGroup, sets, note, isEdit }: ExerciseProps) {
	const [editMenu, setEditMenu] = useState(false);

	return (
		<View className="py-4">
			<View className="mb-2 flex-row items-center">
				<View className="flex-1 flex-row items-center">
					<Text className="flex font-semibold text-text text-xl">{name}</Text>
					{isEdit && (
						<TouchableOpacity
							className="ml-2 rounded-full bg-secondary p-1.5"
							onPress={() => setEditMenu(true)}
						>
							<Pencil color="white" size={14} />
						</TouchableOpacity>
					)}
				</View>

				<Text className="rounded-xl border border-inactive px-2 py-1 font-light text-muted">
					{muscleGroup}
				</Text>
			</View>
			<FlatList
				data={sets}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<ExerciseSet order={item.order} reps={item.reps} weight={item.weight} />
				)}
			/>
			{note && <Text className="mt-2 text-muted">{note}</Text>}
			<EditMenuModal
				exerciseId={_id}
				setSheetVisible={setEditMenu}
				setsLength={sets?.length}
				sheetVisible={editMenu}
			/>
		</View>
	);
}
