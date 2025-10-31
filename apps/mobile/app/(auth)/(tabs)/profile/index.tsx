import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Weight } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import Links from "@/components/profile/links";
import ProfileHeader from "@/components/profile/profile-header";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Profile() {
	const { data: session } = authClient.useSession();
	const userWeight = useQuery(api.userWeights.getUserWeight);
	const workouts = useQuery(api.workouts.getUserWorkouts);

	if (!session) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ProfileHeader text="Username" />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="mt-2 mb-6 flex-row items-center gap-6">
					<View className="h-[90px] w-[90px] rounded-full bg-gray-700" />
					<View className="gap-1">
						<Text className="font-semibold text-3xl text-white">{session.user.name}</Text>
						<Text className="text-muted text-xl">Powerlifter</Text>
					</View>
				</View>

				<View className="flex-row gap-5.5">
					<View className="w-[47%] items-center gap-2 rounded-xl bg-secondary p-3">
						<View className="flex-row items-center gap-2">
							<Ionicons color={COLORS.muted} name="calendar-clear-outline" size={20} />
							<Text className="text-lg text-muted">Tréninky</Text>
						</View>
						<Text className="text-lg text-white tracking-wider">
							{workouts ? workouts.length : 0}
						</Text>
					</View>

					<View className="w-[47%] items-center gap-2 rounded-xl bg-secondary p-3">
						<View className="flex-row items-center gap-2">
							<Weight color={COLORS.muted} size={20} />
							<Text className="text-lg text-muted">Váha</Text>
						</View>
						<Text className="text-lg text-white tracking-wider">{userWeight?.weight}kg</Text>
					</View>
				</View>

				<View className="my-8 h-0.5 w-full bg-secondary" />

				<Links />
			</ScrollView>
		</View>
	);
}
