import { KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import ComponentHeader from "@/components/component-header";

export default function Jmeno() {
	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-6" keyboardVerticalOffset={60}>
			<View className="gap-5">
				<ComponentHeader text="Změna jména" />
				<TextInput
					autoFocus
					className="w-full rounded-2xl bg-secondary p-4 text-lg text-text caret-text"
					defaultValue="username"
					returnKeyType="done"
					submitBehavior="blurAndSubmit"
				/>
			</View>
			<Pressable className="mt-auto mb-4 rounded-2xl bg-accent py-3">
				<Text className="text-center font-medium text-2xl text-text">Uložit</Text>
			</Pressable>
		</KeyboardAvoidingView>
	);
}
