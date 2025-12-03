import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function VahaSet() {
	const [weight, setWeight] = useState("");
	const addWeight = useMutation(api.userWeights.addUserWeight);
	const router = useRouter();
	const [errMsg, setErrMsg] = useState("");

	const handleAdd = () => {
		if (weight.toString().trim() === "" || Number.isNaN(Number(weight))) {
			return;
		}

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

		Keyboard.dismiss();
		addWeight({ weight });
		setWeight("");
		router.push("/(auth)/(tabs)/profile");
	};

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Přidání váhy (kg)" />
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
				{errMsg !== "" && (
					<View className="items-center">
						<Text className="text-base text-destructive">{errMsg}</Text>
					</View>
				)}
			</View>
			<TouchableOpacity
				className="mt-auto mb-4 flex-row items-center justify-center gap-2 rounded-2xl bg-accent py-3"
				onPress={handleAdd}
			>
				<Plus color="white" size={26} />
				<Text className="text-center font-semibold text-text text-xl">Přidat váhu</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}
