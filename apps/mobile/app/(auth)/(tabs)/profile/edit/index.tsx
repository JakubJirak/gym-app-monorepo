import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";
import { api } from "../../../../../../../packages/convex/convex/_generated/api";

export default function Edit() {
	const { data: session } = authClient.useSession();
	const userWeight = useQuery(api.userWeights.getUserWeight);

	if (!session) {
		return null;
	}

	return (
		<KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary px-4" keyboardVerticalOffset={60}>
			<ComponentHeader text="Upravit profil" />
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: COLORS.primary,
				}}
			>
				<View className="mt-8 mb-3 gap-3">
					<View className="items-center gap-4">
						<View>
							<View className="relative h-[110px] w-[110px] rounded-full bg-gray-700" />
							<View className="absolute right-0 bottom-0 size-10 items-center justify-center rounded-full bg-accent">
								<Ionicons color="white" name="pencil" size={20} />
							</View>
						</View>

						<View className="gap-1">
							<Text className="text-center font-bold text-3xl text-white">
								{session.user.name}
							</Text>
							<Text className="text-center text-lg text-muted">Powerlifter</Text>
						</View>
					</View>
				</View>

				<View className="gap-4">
					<Link href="/(auth)/(tabs)/profile/edit/vaha" style={{ width: "100%" }}>
						<View className="my-3 w-full gap-2">
							<Text className="font-semibold text-lg text-white tracking-wide">Váha</Text>
							<View className="h-15 rounded-2xl bg-secondary p-4 caret-white">
								<Text className="text-lg text-white">{userWeight?.weight}kg</Text>
							</View>
						</View>
					</Link>

					<Link href="/(auth)/(tabs)/profile/edit/jmeno" style={{ width: "100%" }}>
						<View className="my-3 w-full gap-2">
							<Text className="font-semibold text-lg text-white tracking-wide">Jméno</Text>
							<View className="h-15 rounded-2xl bg-secondary p-4 caret-white">
								<Text className="text-lg text-white">79.00</Text>
							</View>
						</View>
					</Link>

					<Link href="/(auth)/(tabs)/profile/edit/zamereni" style={{ width: "100%" }}>
						<View className="my-3 w-full gap-2">
							<Text className="font-semibold text-lg text-white tracking-wide">
								Zaměření
							</Text>
							<View className="h-15 rounded-2xl bg-secondary p-4 caret-white">
								<Text className="text-lg text-white">79.00</Text>
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
