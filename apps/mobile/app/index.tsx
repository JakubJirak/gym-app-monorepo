import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../packages/convex/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { authClient } from "../src/lib/auth-client";

export default function Index() {
  const tasks = useQuery(api.test.get);
  const { isAuthenticated } = useConvexAuth();
  //console.log(tasks);
  //const session = useQuery(api.users.getCurrentUser);

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

      console.log({ data, error })
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

  //console.log(session);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{tasks?.length} tohle je test</Text>
      <Text>Welcome</Text>
      <Text>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</Text>
      <TouchableOpacity onPress={() => handleSignIn()}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSignUp()}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
