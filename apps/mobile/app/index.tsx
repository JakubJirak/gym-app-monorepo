import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../packages/convex/convex/_generated/api";
import { useQuery } from "convex/react";
import { authClient } from "../src/lib/auth-client";

export default function Index() {
  const tasks = useQuery(api.test.get);
  const { data: session } = authClient.useSession();

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Test {tasks?.length}</Text>
      <Text>Welcome, {session?.user.name}</Text>
      <TouchableOpacity onPress={() => handleSignIn()}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSignUp()}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
