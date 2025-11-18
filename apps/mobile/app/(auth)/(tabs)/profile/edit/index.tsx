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
	const desc = useQuery(api.description.getUserDescription);

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
							<Text className="text-center font-bold text-3xl text-text">
								{session.user.name}
							</Text>
							<Text className="text-center text-lg text-muted">{desc?.description}</Text>
						</View>
					</View>
				</View>

				<View className="gap-4">
					{userWeight ? (
						<Link href="/(auth)/(tabs)/profile/edit/vaha" style={{ width: "100%" }}>
							<View className="my-3 w-full gap-2">
								<Text className="font-semibold text-lg text-text tracking-wide">
									Váha
								</Text>
								<View className="h-15 rounded-2xl bg-secondary p-4 caret-text">
									<Text className="text-lg text-text">{userWeight.weight}kg</Text>
								</View>
							</View>
						</Link>
					) : (
						<Link href="/(auth)/(tabs)/profile/edit/vahaset" style={{ width: "100%" }}>
							<View className="my-3 w-full gap-2">
								<Text className="font-semibold text-lg text-text tracking-wide">
									Váha
								</Text>
								<View className="h-15 rounded-2xl bg-secondary p-4 caret-text">
									<Text className="text-lg text-text">Nastavte váhu</Text>
								</View>
							</View>
						</Link>
					)}

					<Link href="/(auth)/(tabs)/profile/edit/jmeno" style={{ width: "100%" }}>
						<View className="my-3 w-full gap-2">
							<Text className="font-semibold text-lg text-text tracking-wide">Jméno</Text>
							<View className="h-15 rounded-2xl bg-secondary p-4 caret-text">
								<Text className="text-lg text-text">{session.user.name}</Text>
							</View>
						</View>
					</Link>

					{desc ? (
						<Link href="/(auth)/(tabs)/profile/edit/popis" style={{ width: "100%" }}>
							<View className="my-3 w-full gap-2">
								<Text className="font-semibold text-lg text-text tracking-wide">
									Popis
								</Text>
								<View className="h-15 rounded-2xl bg-secondary p-4 caret-text">
									<Text className="text-lg text-text">{desc?.description}</Text>
								</View>
							</View>
						</Link>
					) : (
						<Link href="/(auth)/(tabs)/profile/edit/popisset" style={{ width: "100%" }}>
							<View className="my-3 w-full gap-2">
								<Text className="font-semibold text-lg text-text tracking-wide">
									Popis
								</Text>
								<View className="h-15 rounded-2xl bg-secondary p-4 caret-text">
									<Text className="text-lg text-text">Nenastaveno</Text>
								</View>
							</View>
						</Link>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
