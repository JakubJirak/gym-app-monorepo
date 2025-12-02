import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function VahaSet() {
	const [weight, setWeight] = useState("");
	const addWeight = useMutation(api.userWeights.addUserWeight);
	const router = useRouter();

	const handleAdd = () => {
		if (weight.toString().trim() === "" || Number.isNaN(Number(weight))) {
			return;
		}
		Keyboard.dismiss();
		addWeight({ weight });
		setWeight("");
		router.push("/(auth)/(tabs)/profile");
	};

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Nastavení váhy (kg)" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					keyboardType="numeric"
					maxLength={5}
					onChangeText={(text) => setWeight(text)}
					onSubmitEditing={handleAdd}
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
					value={weight}
				/>
			</View>
			<Pressable className="mt-auto mb-4 rounded-2xl bg-accent py-3" onPress={handleAdd}>
				<Text className="text-center font-medium text-2xl text-text">Nastavit</Text>
			</Pressable>
		</KeyboardAvoidingView>
	);
}
