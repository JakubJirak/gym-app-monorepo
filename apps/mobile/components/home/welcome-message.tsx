import { Dumbbell } from "lucide-react-native";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

export default function WelcomeMessage() {
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 7) {
			return "Dobré ráno";
		}
		if (hour < 12) {
			return "Dobré dopoledne";
		}
		if (hour < 18) {
			return "Dobré odpoledne";
		}
		return "Dobrý večer";
	};

	return (
		<View className="gap-2">
			<View className="flex-row items-center gap-4">
				<Dumbbell color={COLORS.accent} size={28} />
				<Text className="font-bold text-3xl text-text">{getGreeting()}</Text>
			</View>
			<Text className="text-base text-muted">Připraven na další trénink?</Text>
		</View>
	);
}
