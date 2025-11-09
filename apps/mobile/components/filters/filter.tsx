import { Text, View } from "react-native";

export default function Filter({ name, color }: { name: string; color: string }) {
	return (
		<View className="my-3 flex-row items-center gap-4">
			<View style={{ backgroundColor: color, height: 20, width: 4, borderRadius: 100 }} />
			<Text className="text-text text-xl">{name}</Text>
		</View>
	);
}
