import { Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";
import { useState } from "react";

export default function Vaha() {
  const [weight, setWeight] = useState("");
  const editWeight = useMutation(api.userWeights.updateUserWeight);

  const handleEdit = () => {

  }

	return (
		<View className="flex-1 bg-primary px-4">
			<View className="gap-5">
				<ComponentHeader text="Změna váhy (kg)" />
				<TextInput
					className="bg-secondary rounded-2xl caret-white p-4 text-white text-lg w-full"
					keyboardType="numeric"
					value={weight}
					onChangeText={(text) => setWeight(text)}
				/>
			</View>
			<Pressable className="bg-accent mt-auto mb-4 py-3 rounded-2xl" onPress={handleEdit}>
				<Text className="text-white text-center text-2xl font-medium">
					Uložit
				</Text>
			</Pressable>
		</View>
	);
}
