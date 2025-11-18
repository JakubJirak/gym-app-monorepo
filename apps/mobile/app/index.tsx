import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/COLORS";

export default function Index() {
	const router = useRouter();

	return (
		<>
			<SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.primary }} />
			<View className="flex-1 justify-between bg-primary px-6 py-8">
				<View className="mt-20 gap-3">
					<Text className="text-center font-bold text-5xl text-white">Vítejte v aplikaci</Text>
					<Text className="text-center font-bold text-5xl text-white">GYM TRACKER!</Text>
					<Text className="mt-4 text-center text-lg text-muted">
						Sledujte svůj pokrok a dosahujte svých fitness cílů
					</Text>
				</View>

				<View className="mb-16 gap-4">
					<TouchableOpacity
						className="rounded-xl bg-accent px-6 py-4"
						onPress={() => router.push("/sign-in")}
					>
						<Text className="text-center font-semibold text-white text-xl">Přihlásit se</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="rounded-xl border border-accent bg-secondary px-6 py-4"
						onPress={() => router.push("/sign-up")}
					>
						<Text className="text-center font-semibold text-white text-xl">Registrovat se</Text>
					</TouchableOpacity>
				</View>
			</View>
			<SafeAreaView edges={["bottom"]} style={{ backgroundColor: COLORS.primary }} />
		</>
	);
}
