import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Weight } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Links from "@/components/profile/links";
import ProfileHeader from "@/components/profile/profile-header";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Profile() {
	const overview = useQuery(api.profile.getMobileProfileOverview);
	const router = useRouter();

	if (overview === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-primary">
				<ActivityIndicator color={COLORS.accent} size="large" />
			</View>
		);
	}

	if (!overview) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ProfileHeader text={overview.name} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="mt-2 mb-6 flex-row items-center gap-6">
					<View className="h-22.5 w-22.5 rounded-full bg-gray-700" />
					<View className="gap-1">
						<Text className="font-semibold text-3xl text-text">{overview.name}</Text>
						{overview.description && (
							<Text className="text-muted text-xl">{overview.description}</Text>
						)}
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
						<Text className="text-lg text-text tracking-wider">{overview.workoutCount}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						className="w-[47%] items-center gap-2 rounded-xl bg-secondary p-3"
						onPress={() => router.push("/profile/edit/vaha")}
					>
						<View className="flex-row items-center gap-2">
							<Weight color={COLORS.muted} size={20} />
							<Text className="text-lg text-muted">Váha</Text>
						</View>
						<Text
							className={
								overview.weight
									? "text-lg text-text tracking-wider"
									: "text-base text-muted"
							}
						>
							{overview.weight ? `${overview.weight} kg` : "Nenastaveno"}
						</Text>
					</TouchableOpacity>
				</View>

				<View className="my-8 h-0.5 w-full bg-secondary" />

				<Links />
			</ScrollView>
		</View>
	);
}
