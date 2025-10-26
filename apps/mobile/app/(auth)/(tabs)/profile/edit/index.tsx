import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Edit() {
	const { data: session } = authClient.useSession();
	const userWeight = useQuery(api.userWeights.getUserWeight);

	if (!session) return null;

	return (
		<KeyboardAvoidingView
			behavior="padding"
			keyboardVerticalOffset={60}
			className="flex-1 bg-primary px-4"
		>
			<ComponentHeader text="Upravit profil" />
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: COLORS.primary,
				}}
			>
				<View className="gap-3 mt-8 mb-3">
					<View className="gap-4 items-center">
						<View>
							<View className="w-[110px] h-[110px] rounded-full bg-gray-700 relative" />
							<View className="absolute bottom-0 right-0 bg-accent size-10 items-center justify-center rounded-full">
								<Ionicons name="pencil" size={20} color="white" />
							</View>
						</View>

						<View className="gap-1">
							<Text className="text-white text-3xl font-bold text-center">
								{session.user.name}
							</Text>
							<Text className="text-muted text-lg text-center">
								Powerlifter
							</Text>
						</View>
					</View>
				</View>

				<View className="gap-4">
					<Link
						href="/(auth)/(tabs)/profile/edit/vaha"
						style={{ width: "100%" }}
					>
						<View className="gap-2 my-3 w-full">
							<Text className="text-white font-semibold tracking-wide text-lg">
								Váha
							</Text>
							<View className="bg-secondary h-15 rounded-2xl caret-white p-4">
                <Text className="text-white text-lg">{userWeight?.weight}kg</Text>
							</View>
						</View>
					</Link>

					<Link
						href="/(auth)/(tabs)/profile/edit/jmeno"
						style={{ width: "100%" }}
					>
						<View className="gap-2 my-3 w-full">
							<Text className="text-white font-semibold tracking-wide text-lg">
								Jméno
							</Text>
							<View className="bg-secondary h-15 rounded-2xl caret-white p-4">
								<Text className="text-white text-lg">79.00</Text>
							</View>
						</View>
					</Link>

					<Link
						href="/(auth)/(tabs)/profile/edit/zamereni"
						style={{ width: "100%" }}
					>
						<View className="gap-2 my-3 w-full">
							<Text className="text-white font-semibold tracking-wide text-lg">
								Zaměření
							</Text>
							<View className="bg-secondary h-15 rounded-2xl caret-white p-4">
								<Text className="text-white text-lg">79.00</Text>
							</View>
						</View>
					</Link>
				</View>

				{/*<View className="gap-2 my-3 pb-4">
				<Text className="text-white font-semibold tracking-wide text-lg">
					Email
				</Text>
				<TextInput
					className="bg-secondary rounded-2xl caret-white p-4 text-white text-lg"
					defaultValue="test@test.com"
					inputMode="email"
				/>
			</View>*/}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
