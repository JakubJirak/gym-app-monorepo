import { Ionicons } from "@expo/vector-icons";
import { Pencil } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function TrainingFooter({ id }: { id: string }) {
	const stopid = () => {
		console.log(id);
	};
	return (
		<View className="flex-row items-center pb-8 h-[72px] bg-[#0a0a0a] border-t border-[#1a1a1a] pr-2">
			<TouchableOpacity
				className="w-1/4 flex items-center pt-2"
				onPress={stopid}
			>
				<Ionicons name="share-social-outline" size={24} color="white" />
			</TouchableOpacity>
			<TouchableOpacity className="w-1/4 flex items-center pt-2">
				<Ionicons name="add-outline" size={32} color="white" />
			</TouchableOpacity>
			<TouchableOpacity className="w-1/4 flex items-center pt-2">
				<Pencil size={22} color="white" />
			</TouchableOpacity>
			<TouchableOpacity className="w-1/4 flex items-center pt-2">
				<Ionicons name="trash-outline" size={24} color="white" />
			</TouchableOpacity>
		</View>
	);
}
