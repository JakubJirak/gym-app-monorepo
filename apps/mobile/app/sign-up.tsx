import { useForm } from "@tanstack/react-form";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

const signUpSchema = z
	.object({
		name: z.string().min(1, "Jméno je povinné").max(30, "Jméno je příliš dlouhé"),
		email: z.email("Zadejte platný email").max(60, "Email je příliš dlouhý"),
		password: z.string().min(8, "Heslo musí mít alespoň 8 znaků").max(100, "Heslo je příliš dlouhé"),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Hesla se neshodují",
		path: ["passwordConfirm"],
	});

export default function SignUp() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			passwordConfirm: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onRequest: () => {
						setIsLoading(true);
					},
					onSuccess: () => {
						console.log("SIGNED IN");
						setIsLoading(false);
					},
					onError: (ctx) => {
						setIsLoading(false);
						setIsError(true);
						setErrorMessage(ctx.error.message);
					},
				}
			);
		},
		validators: {
			onChange: signUpSchema,
		},
	});

	return (
		<>
			<SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }} />
			<KeyboardAvoidingView
				behavior="padding"
				className="flex-1 bg-primary px-6"
				keyboardVerticalOffset={35}
			>
				<ScrollView className="bg-primary py-3.5" showsVerticalScrollIndicator={false}>
					<View className="gap-6">
						<Text className="mt-4 text-center font-bold text-4xl text-white">Registrace</Text>
						<View className="gap-4">
							<form.Field name="name">
								{(field) => (
									<View className="gap-2">
										<Text className="font-medium text-base text-white">
											Jméno
										</Text>
										<TextInput
											className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
											onChangeText={field.handleChange}
											placeholder="Vaše jméno"
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
											placeholder="Vaše heslo"
											placeholderTextColor={COLORS.muted}
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
							<form.Field name="passwordConfirm">
								{(field) => (
									<View className="gap-2">
										<Text className="font-medium text-base text-white">
											Heslo znovu
										</Text>
										<TextInput
											className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
											onChangeText={field.handleChange}
											onSubmitEditing={() => {
												if (form.state.canSubmit) {
													form.handleSubmit();
												}
											}}
											placeholder="Zopakujte heslo"
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
									className={`mt-4 rounded-xl px-5 py-3 ${
										formState.canSubmit ? "bg-accent" : "bg-disabled"
									}`}
									disabled={!formState.canSubmit}
									onPress={form.handleSubmit}
								>
									<Text className="text-center font-semibold text-lg text-white">
										{isLoading ? "Načítání..." : "Registrovat se"}
									</Text>
								</TouchableOpacity>
							)}
						</form.Subscribe>
						<View className="mx-auto flex-row gap-1.5">
							<Text className="text-white">Už máte účet?</Text>
							<Link href="/sign-in">
								<Text className="text-accent text-sm">Přihlaste se</Text>
							</Link>
						</View>
						{isError && <Text className="mt-2 text-center text-red-500">{errorMessage}</Text>}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<SafeAreaView edges={["bottom"]} style={{ backgroundColor: COLORS.primary }} />
		</>
	);
}
