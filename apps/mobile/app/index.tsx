import { useConvexAuth } from "convex/react";
import { Text, View } from "react-native";
import { authClient } from "../src/lib/auth-client";
import { Link } from "expo-router";

export default function Index() {
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
