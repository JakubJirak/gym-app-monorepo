import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Weight } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Links from "@/components/profile/links";
import ProfileHeader from "@/components/profile/profile-header";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Profile() {
	const { data: session } = authClient.useSession();
	const userWeight = useQuery(api.userWeights.getUserWeight);
	const workouts = useQuery(api.workouts.getUserWorkouts);
	const desc = useQuery(api.description.getUserDescription);
	const router = useRouter();

	if (userWeight === undefined || workouts === undefined || desc === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ProfileHeader text={session.user.name} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="mt-2 mb-6 flex-row items-center gap-6">
					<View className="h-[90px] w-[90px] rounded-full bg-gray-700" />
					<View className="gap-1">
						<Text className="font-semibold text-3xl text-text">{session.user.name}</Text>
						{desc && <Text className="text-muted text-xl">{desc.description}</Text>}
					</View>
				</View>

				<View className="flex-row gap-5.5">
					<TouchableOpacity
						className="w-[47%] items-center gap-2 rounded-xl bg-secondary p-3"
						onPress={() => router.push("/trainings")}
					>
						<View className="flex-row items-center gap-2">
							<Ionicons color={COLORS.muted} name="calendar-clear-outline" size={20} />
							<Text className="text-lg text-muted">Tréninky</Text>
						</View>
						<Text className="text-lg text-text tracking-wider">
							{workouts ? workouts.length : 0}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						className="w-[47%] items-center gap-2 rounded-xl bg-secondary p-3"
						onPress={() => {
							if (!userWeight) {
								router.push("/profile/edit/vahaset");
							}
						}}
					>
						<View className="flex-row items-center gap-2">
							<Weight color={COLORS.muted} size={20} />
							<Text className="text-lg text-muted">Váha</Text>
						</View>
						<Text
							className={
								userWeight ? "text-lg text-text tracking-wider" : "text-base text-muted"
							}
						>
							{userWeight ? `${userWeight.weight} kg` : "Nenastaveno"}
						</Text>
					</TouchableOpacity>
				</View>

				<View className="my-8 h-0.5 w-full bg-secondary" />

				<Links />
			</ScrollView>
		</View>
	);
}
