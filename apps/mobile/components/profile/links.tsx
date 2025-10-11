import { View } from "react-native";
import ProfileLink from "./profile-link";

export default function Links() {
	return (
		<View className="gap-3 pb-4">
			<ProfileLink
				href="/profile/goals"
				icon="trophy-outline"
				text="Váhy a cíle"
			/>

			<ProfileLink
				href="/profile/exercises"
				icon="barbell-outline"
				text="Cviky"
			/>

			<ProfileLink href="/profile/rutiny" icon="layers-outline" text="Rutiny" />

			<ProfileLink
				href="/profile/friends"
				icon="people-outline"
				text="Přátelé"
			/>

			<ProfileLink
				href="/profile/edit"
				icon="options-outline"
				text="Upravit profil"
			/>

			<ProfileLink
				href="/profile/settings"
				icon="settings-outline"
				text="Nastavení"
			/>
		</View>
	);
}
