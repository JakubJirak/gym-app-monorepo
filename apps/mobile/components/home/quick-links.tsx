import { Ionicons } from "@expo/vector-icons";
import { type Href, Link } from "expo-router";
import { Calendar, History } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

const quickLinks = [
	{
		title: "Váhy a cíle",
		icon: () => <Ionicons color={COLORS.accent} name="trophy-outline" size={28} />,
		href: "/(auth)/(tabs)/profile/goals",
	},
	{
		title: "Historie cviků",
		icon: History,
		href: "/(auth)/(tabs)/stats/history",
	},
	{
		title: "Kalendář",
		icon: Calendar,
		href: "/(auth)/(tabs)/stats/calendar",
	},
	{
		title: "Přidat cvik",
		icon: () => <Ionicons color={COLORS.accent} name="barbell-outline" size={28} />,
		href: "/(auth)/(tabs)/profile/exercises",
	},
];

export default function QuickLinks() {
	return (
		<View className="gap-3">
			<View className="mb-1 flex-row items-center gap-2">
				<Calendar color={COLORS.accent} size={20} />
				<Text className="font-semibold text-text text-xl">Rychlé odkazy</Text>
			</View>
			<View className="flex-row flex-wrap gap-3">
				{quickLinks.map((link) => (
					<Link asChild href={link.href as Href} key={link.title}>
						<TouchableOpacity
							activeOpacity={0.7}
							className="min-w-[45%] flex-1 items-center gap-2 rounded-xl bg-secondary p-4"
						>
							<link.icon color={COLORS.accent} size={28} />
							<Text className="text-center text-muted text-sm">{link.title}</Text>
						</TouchableOpacity>
					</Link>
				))}
			</View>
		</View>
	);
}
