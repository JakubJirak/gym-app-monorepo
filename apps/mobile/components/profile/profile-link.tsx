import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import type React from "react";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type LinkHref = React.ComponentProps<typeof Link>["href"];
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface ProfileLinkProps {
	href: LinkHref;
	icon: IoniconName;
	text: string;
}

export default function ProfileLink({ href, icon, text }: ProfileLinkProps) {
	return (
		<Link
			href={href}
			style={{
				padding: 20,
				backgroundColor: COLORS.secondary,
				borderRadius: 12,
			}}
		>
			<View className="flex flex-row items-center gap-6">
				<Ionicons name={icon} size={28} color={COLORS.accent} />
				<Text className="text-white text-xl tracking-wider flex-1">{text}</Text>
				<View className="">
					<Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
				</View>
			</View>
		</Link>
	);
}
