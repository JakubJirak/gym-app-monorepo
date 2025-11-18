import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Popis() {
	const userDescription = useQuery(api.description.getUserDescription);
	const [description, setDescription] = useState(userDescription ? userDescription.description : "");
	const editDescription = useMutation(api.description.editUserDescription);

	const handleEdit = async () => {
		const trimmed = description.trim();
		if (trimmed === "") {
			return;
		}

		if (userDescription) {
			await editDescription({
				descriptionId: userDescription._id,
				description: trimmed,
			});
			router.push("/(auth)/(tabs)/profile");
			setDescription("");
		}
	};

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Změna popisu" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					defaultValue={userDescription ? userDescription.description : ""}
					onChangeText={setDescription}
					onSubmitEditing={handleEdit}
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
					value={description}
				/>
			</View>
			<TouchableOpacity className="mt-auto mb-4 rounded-2xl bg-accent py-2.5" onPress={handleEdit}>
				<Text className="text-center font-medium text-2xl text-text">Uložit</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}
