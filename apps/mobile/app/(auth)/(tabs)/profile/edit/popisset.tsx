import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function PopisSet() {
	const [popis, setPopis] = useState("");
	const addPopis = useMutation(api.description.addUserDescription);
	const router = useRouter();

	const handleAdd = () => {
		if (popis.toString().trim() === "") {
			return;
		}
		Keyboard.dismiss();
		addPopis({ description: popis });
		setPopis("");
		router.push("/(auth)/(tabs)/profile");
	};

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Nastavení popisu" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					maxLength={20}
					onChangeText={(text) => setPopis(text)}
					onSubmitEditing={handleAdd}
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
					value={popis}
				/>
			</View>

			<TouchableOpacity
				className="mt-auto mb-4 flex-row items-center justify-center gap-2 rounded-2xl bg-accent py-3"
				onPress={handleAdd}
			>
				<Plus color="white" size={26} />
				<Text className="text-center font-semibold text-text text-xl">Přidat popis</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}
