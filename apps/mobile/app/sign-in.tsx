import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

const signInSchema = z.object({
	email: z.string().email("Zadejte platný email").max(60, "Email je příliš dlouhý"),
	password: z.string().min(8, "Heslo musí mít alespoň 8 znaků").max(100, "Heslo je příliš dlouhé"),
});

export default function SignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			setIsError(false);
			setErrorMessage("");
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onRequest: () => {
						setIsLoading(true);
					},
					onSuccess: () => {
						setIsLoading(false);
						setIsError(false);
						setErrorMessage("");
					},
					onError: (ctx) => {
						setIsLoading(false);
						setIsError(true);
						setErrorMessage(ctx.error.message || "Nastala chyba při přihlášení");
					},
				}
			);
		},
		validators: {
			onChange: signInSchema,
		},
	});

	return (
		<>
			<SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				keyboardVerticalOffset={40}
			>
				<View className="flex-1 bg-primary px-6 py-8">
					<View className="gap-6">
						<Text className="text-center font-bold text-4xl text-white">Přihlášení</Text>
						<View className="gap-4">
							<form.Field name="email">
								{(field) => (
									<View className="gap-2">
										<Text className="font-medium text-base text-white">
											Email
										</Text>
										<TextInput
											autoCapitalize="none"
											className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
											keyboardType="email-address"
											onChangeText={field.handleChange}
											placeholder="vas@email.cz"
											placeholderTextColor={COLORS.muted}
											value={field.state.value}
										/>
										{field.state.meta.isTouched && !field.state.meta.isValid ? (
											<Text className="mt-1 text-red-500 text-xs">
												{field.state.meta.errors[0]?.message}
											</Text>
										) : null}
									</View>
								)}
							</form.Field>
							<form.Field name="password">
								{(field) => (
									<View className="gap-2">
										<Text className="font-medium text-base text-white">
											Heslo
										</Text>
										<TextInput
											className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
											onChangeText={field.handleChange}
											onSubmitEditing={() => {
												if (form.state.canSubmit) {
													form.handleSubmit();
												}
											}}
											placeholder="Vaše heslo"
											placeholderTextColor={COLORS.muted}
											returnKeyType="done"
											secureTextEntry
											value={field.state.value}
										/>
										{field.state.meta.isTouched && !field.state.meta.isValid ? (
											<Text className="mt-1 text-red-500 text-xs">
												{field.state.meta.errors[0]?.message}
											</Text>
										) : null}
									</View>
								)}
							</form.Field>
						</View>
						<form.Subscribe>
							{(formState) => (
								<TouchableOpacity
									activeOpacity={0.8}
									className={`mt-4 rounded-xl px-6 py-4 ${formState.canSubmit ? "bg-accent" : "bg-disabled"}`}
									disabled={!formState.canSubmit || isLoading}
									onPress={form.handleSubmit}
								>
									<Text className="text-center font-semibold text-lg text-white">
										{isLoading ? "Načítání..." : "Přihlásit se"}
									</Text>
								</TouchableOpacity>
							)}
						</form.Subscribe>
						{isError && <Text className="mt-2 text-center text-red-500">{errorMessage}</Text>}
					</View>
				</View>
			</KeyboardAvoidingView>
			<SafeAreaView edges={["bottom"]} style={{ backgroundColor: COLORS.primary }} />
		</>
	);
}
