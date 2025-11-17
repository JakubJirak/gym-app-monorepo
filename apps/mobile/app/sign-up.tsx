import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const isFormValid = name && email && password && passwordConfirm && password === passwordConfirm;
	const isDisabled = !isFormValid;

	const handleSignUp = async () => {
		if (isDisabled) {
			return;
		}

		const { data, error } = await authClient.signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onRequest: () => {
					console.log("REQUESTING");
				},
				onSuccess: () => {
					console.log("SIGNED IN");
				},
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
			}
		);

		console.log({ data, error });
	};

	return (
		<>
			<SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }} />
			<View className="flex-1 bg-primary px-6 py-8">
				<View className="gap-6">
					<Text className="text-center font-bold text-4xl text-white">Registrace</Text>

					<View className="gap-4">
						<View className="gap-2">
							<Text className="font-medium text-base text-white">Jméno</Text>
							<TextInput
								className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
								onChangeText={setName}
								placeholder="Vaše jméno"
								placeholderTextColor={COLORS.muted}
								value={name}
							/>
						</View>

						<View className="gap-2">
							<Text className="font-medium text-base text-white">Email</Text>
							<TextInput
								autoCapitalize="none"
								className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
								keyboardType="email-address"
								onChangeText={setEmail}
								placeholder="vas@email.cz"
								placeholderTextColor={COLORS.muted}
								value={email}
							/>
						</View>

						<View className="gap-2">
							<Text className="font-medium text-base text-white">Heslo</Text>
							<TextInput
								className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
								onChangeText={setPassword}
								placeholder="Vaše heslo"
								placeholderTextColor={COLORS.muted}
								secureTextEntry
								value={password}
							/>
						</View>

						<View className="gap-2">
							<Text className="font-medium text-base text-white">Heslo znovu</Text>
							<TextInput
								className="rounded-xl bg-secondary px-4 py-3 text-base text-white"
								onChangeText={setPasswordConfirm}
								placeholder="Zopakujte heslo"
								placeholderTextColor={COLORS.muted}
								secureTextEntry
								value={passwordConfirm}
							/>
						</View>
					</View>

					<TouchableOpacity
						activeOpacity={0.8}
						className={`mt-4 rounded-xl px-6 py-4 ${isDisabled ? "bg-disabled" : "bg-accent"}`}
						disabled={isDisabled}
						onPress={handleSignUp}
					>
						<Text className="text-center font-semibold text-lg text-white">Registrovat se</Text>
					</TouchableOpacity>
				</View>
			</View>
			<SafeAreaView edges={["bottom"]} style={{ backgroundColor: COLORS.primary }} />
		</>
	);
}
