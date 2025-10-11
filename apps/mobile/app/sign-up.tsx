import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

export default function SignUp() {

  const handleSignUp = async () => {
      const { data, error } = await authClient.signUp.email(
        {
          email: "test2@test.com",
          password: "12345678",
          name: "Test2"
        },
        {
          onRequest: () => {
            console.log("REQUESTING")
          },
          onSuccess: async () => {
            console.log("SIGNED IN")
          },
          onError: (ctx) => {
            console.log(ctx.error.message);
          },
        },
      )

      console.log({ data, error })
    }

	return (
		<>
			<SafeAreaView
				edges={["top"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
			<View className="flex-1 bg-primary">
				<Text className="text-white">signup</Text>
			</View>
			<SafeAreaView
				edges={["bottom"]}
				style={{ backgroundColor: COLORS.primary }}
			/>
		</>
	);
}
