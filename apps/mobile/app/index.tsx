import { Text, View } from "react-native";
import { api } from "../../../packages/convex/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { authClient } from "../src/lib/auth-client";

export default function Index() {
  const tasks = useQuery(api.test.get);
  const { data: session } = authClient.useSession();
  const {isAuthenticated, isLoading} = useConvexAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-400">Test {tasks?.length}</Text>
      <Text className="text-white">Welcome, {session?.user.name}</Text>
      <Text className="text-white">{isLoading ? 'loading' : 'hotovo'}</Text>
      <Text className="text-white">{isAuthenticated ? 'ano' : 'ne'}</Text>
    </View>
  );
}
