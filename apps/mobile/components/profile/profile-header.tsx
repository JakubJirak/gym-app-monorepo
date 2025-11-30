import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { authClient } from "@/src/lib/auth-client";

export default function ProfileHeader({ text }: { text: string }) {
	const [visible, setVisible] = useState(false);
	const router = useRouter();

	const closeMenu = () => setVisible(false);
	const toggleMenu = () => setVisible((prev) => !prev);

	return (
		<View className="mt-2 pr-2 pb-4">
			<View className="relative flex-row items-center">
				<View className="w-8">
					<Ionicons color={COLORS.accent} name="person-outline" size={20} />
				</View>

				<Text className="ml-4 flex-1 font-semibold text-2xl text-text">{text}</Text>

				<TouchableOpacity accessibilityLabel="Otevřít menu" className="w-8" onPress={toggleMenu}>
					<Ionicons color="white" name="menu" size={24} />
				</TouchableOpacity>
			</View>

			<Modal animationType="none" onRequestClose={closeMenu} transparent visible={visible}>
				<Pressable className="flex-1" onPress={closeMenu} />

				<View className="absolute top-12 right-4 z-50 min-w-40 overflow-hidden rounded-xl bg-darker px-2 py-2 shadow-md">
					{/* <TouchableOpacity
						className="flex flex-row items-center gap-3 px-3 py-3"
						onPress={() => {
							router.navigate("/profile/settings");
							closeMenu();
						}}
					>
						<Ionicons color={COLORS.accent} name="settings-outline" size={20} />
						<Text className="text-lg text-text">Nastavení</Text>
					</TouchableOpacity> */}

					<TouchableOpacity
						className="flex flex-row items-center gap-3 px-3 py-3"
						onPress={() => {
							router.navigate("/profile/edit");
							closeMenu();
						}}
					>
						<Ionicons color={COLORS.accent} name="options-outline" size={21} />
						<Text className="text-lg text-text">Upravit profil</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="flex flex-row items-center gap-2.5 px-3 py-3"
						onPress={() => {
							router.navigate("/profile/about");
							closeMenu();
						}}
					>
						<Ionicons color={COLORS.accent} name="information-circle-outline" size={22} />
						<Text className="text-lg text-text">O aplikaci</Text>
					</TouchableOpacity>

					<View className="my-1 h-px bg-border" />
					<TouchableOpacity
						className="flex flex-row items-center gap-2.5 px-3 py-3"
						onPress={() => {
							authClient.signOut();
						}}
					>
						<Ionicons color={COLORS.accent} name="log-out-outline" size={22} />
						<Text className="text-lg text-text">Odhlásit se</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
}
