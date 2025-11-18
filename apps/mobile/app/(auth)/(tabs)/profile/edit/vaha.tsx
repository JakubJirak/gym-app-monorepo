import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Vaha() {
	const userWeight = useQuery(api.userWeights.getUserWeight);
	const [weight, setWeight] = useState(userWeight ? String(userWeight.weight) : "");
	const editWeight = useMutation(api.userWeights.updateUserWeight);

	const handleEdit = async () => {
		const trimmed = weight.toString().trim();
		if (trimmed === "" || Number.isNaN(Number(trimmed))) {
			return;
		}

		const numeric = Number(trimmed);
		if (numeric > 200 || numeric < 10) {
			setWeight("");
			return;
		}

		if (userWeight) {
			await editWeight({
				weightId: userWeight._id,
				changeWeight: trimmed,
			});
			router.push("/(auth)/(tabs)/profile");
		}
	};

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Změna váhy (kg)" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					defaultValue={userWeight ? String(userWeight.weight) : ""}
					keyboardType="numeric"
					onChangeText={(text) => setWeight(text)}
					onSubmitEditing={handleEdit}
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
					value={weight}
				/>
			</View>
			<Pressable className="mt-auto mb-4 rounded-2xl bg-accent py-3" onPress={handleEdit}>
				<Text className="text-center font-medium text-2xl text-text">Uložit</Text>
			</Pressable>
		</KeyboardAvoidingView>
	);
}
