import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

export default function SignIn() {

  const handleSignIn = async () => {
      const { data, error } = await authClient.signIn.email(
        {
          email: "test@test.com",
          password: "12345678",
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
      )

    console.log({ data, error });
    }

	return (
		<>
			<SafeAreaView
				edges={["top"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
			<View className="flex-1 bg-primary">
				<Text className="text-white">signin</Text>
			</View>
			<SafeAreaView
				edges={["bottom"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
		</>
	);
}
