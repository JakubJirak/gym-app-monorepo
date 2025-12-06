import { useQuery } from "convex/react";
import { type Href, Link } from "expo-router";
import { ChevronRight, Lightbulb } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";

export default function Tip() {
	const tips = useQuery(api.tips.getTips);

	const randomTip = useMemo(() => {
		if (!tips || tips.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * tips.length);
		return tips[randomIndex];
	}, [tips]);

	if (!randomTip) {
		return null;
	}

	return (
		<Link className="-my-4" href={randomTip.link as Href}>
			<View className="w-full flex-row items-center gap-4 rounded-xl bg-secondary px-4 py-3.5">
				<View className="rounded-lg bg-accent/20 p-2">
					<Lightbulb color={COLORS.accent} size={20} />
				</View>
				<Text className="flex-1 text-text">{randomTip.content}</Text>
				<ChevronRight color={COLORS.muted} size={20} />
			</View>
		</Link>
	);
}
