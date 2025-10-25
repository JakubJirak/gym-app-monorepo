import { View } from "react-native";
import ComponentHeader from "@/components/component-header";
import ProfileLink from "@/components/profile/profile-link";

export default function Settings() {
	return (
		<View className="flex-1 bg-black px-4">
			<ComponentHeader text="Nastavení" />
			<ProfileLink
				href="/profile/about"
				icon="information-circle-outline"
				text="O aplikaci"
			/>
		</View>
	);
}
