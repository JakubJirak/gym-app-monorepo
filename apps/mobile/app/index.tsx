import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {

	return (
		<View
		  className="flex-1 items-center justify-center bg-primary px-4"
		>
			<Link href="/sign-in">
				<Text className="text-text">sign in</Text>
			</Link>
			<Link href="/sign-up">
				<Text className="text-text">sign up</Text>
			</Link>
		</View>
	);
}
