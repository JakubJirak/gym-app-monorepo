import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

export default function SignIn() {
	const handleSignIn = async () => {
		const { data, error } = await authClient.signIn.email(
			{
				email: "test",
				password: "test",
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
			<TouchableOpacity className="flex-1 bg-primary" onPress={handleSignIn}>
				<Text className="text-text">signin</Text>
			</TouchableOpacity>
			<SafeAreaView edges={["bottom"]} style={{ backgroundColor: COLORS.primary }} />
		</>
	);
}
