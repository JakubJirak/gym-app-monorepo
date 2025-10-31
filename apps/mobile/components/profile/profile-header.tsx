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
		<View className="mt-2 flex-row items-center pr-2 pb-4">
			<View className="w-8">
				<Ionicons color="white" name="person-outline" size={20} />
			</View>
			<Text className="ml-4 flex-1 font-semibold text-2xl text-white">{text}</Text>
			<Menu
				anchor={
					<TouchableOpacity className="w-8" onPress={() => openMenu()}>
						<Ionicons color="white" name="menu" size={24} />
					</TouchableOpacity>
				}
				onDismiss={() => closeMenu()}
				visible={visible}
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
