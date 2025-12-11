import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";
import EditRoutineModal from "./modals/edit-routine-modal";

export default function RoutineHeader({ text, routineId }: { text: string; routineId: string }) {
	const router = useRouter();
	const [openEdit, setOpenEdit] = useState(false);
	const routine = useQuery(api.routines.getRoutineById, { routineId: routineId as Id<"routines"> });

	return (
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<TouchableOpacity className="w-8" onPress={() => router.back()}>
				<Ionicons color={COLORS.accent} name="chevron-back" size={28} />
			</TouchableOpacity>
			<Text className="ml-2 flex-1 font-semibold text-text text-xl">{text}</Text>
			<TouchableOpacity className="w-8" onPress={() => setOpenEdit(true)}>
				<Pencil color="white" size={22} />
			</TouchableOpacity>
			<EditRoutineModal
				defaultFilterId={routine?.filter?._id}
				defaultName={routine?.name}
				routineId={routineId}
				setSheetVisible={setOpenEdit}
				sheetVisible={openEdit}
			/>
		</View>
	);
}
