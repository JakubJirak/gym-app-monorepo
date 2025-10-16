import { useConvexAuth, useQuery } from "convex/react";
import { Text, View } from "react-native";
import { api } from "../../../packages/convex/convex/_generated/api";
import { authClient } from "../src/lib/auth-client";
import { Link } from "expo-router";

export default function Index() {
	const tasks = useQuery(api.test.get);
	const { data: session } = authClient.useSession();
	const { isAuthenticated, isLoading } = useConvexAuth();

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
			<Text className="text-white">loaded: {isLoading ? "ne" : "ano"}</Text>
			<Text className="text-white">auth: {isAuthenticated ? "ano" : "ne"}</Text>
			<Link href="/sign-in">
			  <Text className="text-white">sign in</Text>
			</Link>
			<Link href="/sign-up">
			  <Text className="text-white">sign up</Text>
			</Link>
		</View>
	);
}
