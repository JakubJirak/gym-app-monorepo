import { Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";

export default function Vaha() {
	return (
		<View className="flex-1 bg-primary px-4">
			<View className="gap-5">
				<ComponentHeader text="Změna váhy" />
				<TextInput
					className="bg-secondary rounded-2xl caret-white p-4 text-white text-lg w-full"
					defaultValue="79.00"
				/>
			</View>
			<Pressable className="bg-accent mt-auto mb-4 py-3 rounded-2xl">
				<Text className="text-white text-center text-2xl font-medium">Uložit</Text>
			</Pressable>
		</View>
	);
}
