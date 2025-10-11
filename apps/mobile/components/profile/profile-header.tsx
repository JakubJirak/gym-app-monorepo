import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Menu } from "react-native-paper";

export default function ProfileHeader({ text }: { text: string }) {
	const [visible, setVisible] = useState(false);
	const router = useRouter();
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	return (
		<View className="flex-row items-center mt-2 pb-4 pr-2">
			<View className="w-8">
				<Ionicons name="person-outline" size={20} color="white" />
			</View>
			<Text className="text-white text-2xl ml-4 font-semibold flex-1">
				{text}
			</Text>
			<Menu
				visible={visible}
				onDismiss={() => closeMenu()}
				anchor={
					<TouchableOpacity className="w-8" onPress={() => openMenu()}>
						<Ionicons name="menu" size={24} color="white" />
					</TouchableOpacity>
				}
			>
				<Menu.Item
					onPress={() => {
						router.navigate("/profile/settings");
						closeMenu();
					}}
					title="Nastavení"
				/>
				<Menu.Item
					onPress={() => {
						router.navigate("/profile/edit");
						closeMenu();
					}}
					title="Upravit profil"
				/>
				<Menu.Item
					onPress={() => {
						router.navigate("/profile/about");
						closeMenu();
					}}
					title="O aplikaci"
				/>
			</Menu>
		</View>
	);
}
