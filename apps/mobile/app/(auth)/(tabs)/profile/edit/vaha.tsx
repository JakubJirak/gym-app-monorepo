import { useMutation } from "convex/react";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Vaha() {
	const [weight, setWeight] = useState("");
	const editWeight = useMutation(api.userWeights.updateUserWeight);

	const handleEdit = () => {};

	return (
		<View className="flex-1 bg-primary px-4">
			<View className="gap-5">
				<ComponentHeader text="Změna váhy (kg)" />
				<TextInput
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-white caret-white"
					keyboardType="numeric"
					onChangeText={(text) => setWeight(text)}
					value={weight}
				/>
			</View>
			<Pressable className="mt-auto mb-4 rounded-2xl bg-accent py-3" onPress={handleEdit}>
				<Text className="text-center font-medium text-2xl text-white">Uložit</Text>
			</Pressable>
		</View>
	);
}
