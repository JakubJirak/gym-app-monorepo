import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Vaha() {
	const userWeight = useQuery(api.userWeights.getUserWeight);
	const [weight, setWeight] = useState(userWeight ? String(userWeight.weight) : "");
	const editWeight = useMutation(api.userWeights.updateUserWeight);
	const [errMsg, setErrMsg] = useState("");

	const handleEdit = async () => {
		const trimmed = weight.toString().trim();
		if (trimmed === "" || Number.isNaN(Number(trimmed))) {
			return;
		}

		const numeric = Number(trimmed);
		if (numeric > 200) {
			setWeight("");
			setErrMsg("Váha nesmí být větší než 200 kg");
			return;
		}

		if (numeric < 20) {
			setWeight("");
			setErrMsg("Váha nesmí být menší než 20 kg");
			return;
		}

		if (userWeight) {
			Keyboard.dismiss();
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
				<ComponentHeader fallbackRoute="/(auth)/(tabs)/profile/edit" text="Změna váhy (kg)" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					defaultValue={userWeight ? String(userWeight.weight) : ""}
					keyboardType="numeric"
					maxLength={5}
					onChangeText={(text) => setWeight(text)}
					onSubmitEditing={handleEdit}
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
					value={weight}
				/>
				{errMsg !== "" && (
					<View className="items-center">
						<Text className="text-base text-destructive">{errMsg}</Text>
					</View>
				)}
			</View>
			<TouchableOpacity
				className="mt-auto mb-4 flex-row items-center justify-center gap-3 rounded-2xl bg-accent py-3"
				onPress={handleEdit}
			>
				<Pencil color="white" size={22} />
				<Text className="text-center font-semibold text-text text-xl">Upravit váhu</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}
