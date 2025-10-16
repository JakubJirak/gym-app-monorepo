import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/src/lib/auth-client";
import { COLORS } from "@/constants/COLORS";

export default function SignUp() {
	const handleSignUp = async () => {
		const { data, error } = await authClient.signUp.email(
			{
				email: "test@test.com",
				password: "12345678",
				name: "Test",
			},
			{
				onRequest: () => {
					console.log("REQUESTING");
				},
				onSuccess: async () => {
					console.log("SIGNED IN");
				},
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
			},
		);

		console.log({ data, error });
	};

	return (
		<>
			<SafeAreaView
				edges={["top"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
			<TouchableOpacity onPress={handleSignUp} className="flex-1 bg-primary">
				<Text className="text-white">signup</Text>
			</TouchableOpacity>
			<SafeAreaView
				edges={["bottom"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
		</>
	);
}
