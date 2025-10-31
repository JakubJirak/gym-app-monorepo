import { Ionicons } from "@expo/vector-icons";
import { Pencil } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function TrainingFooter({ id }: { id: string }) {
	const stopid = () => {
		console.log(id);
	};
	return (
		<View className="h-[72px] flex-row items-center border-[#1a1a1a] border-t bg-[#0a0a0a] pr-2 pb-8">
			<TouchableOpacity className="flex w-1/4 items-center pt-2" onPress={stopid}>
				<Ionicons color="white" name="share-social-outline" size={24} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2">
				<Ionicons color="white" name="add-outline" size={32} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2">
				<Pencil color="white" size={22} />
			</TouchableOpacity>
			<TouchableOpacity className="flex w-1/4 items-center pt-2">
				<Ionicons color="white" name="trash-outline" size={24} />
			</TouchableOpacity>
		</View>
	);
}
