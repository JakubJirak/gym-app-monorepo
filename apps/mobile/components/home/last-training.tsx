import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Link } from "expo-router";
import { ChevronRight, Dumbbell } from "lucide-react-native";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type LastTrainingProps = {
	workoutId: string;
	workoutDate: string;
};

export default function LastTraining({ workoutId, workoutDate }: LastTrainingProps) {
	return (
		<View className="gap-3">
			<View className="mb-1 flex-row items-center gap-2">
				<Dumbbell color={COLORS.accent} size={20} />
				<Text className="font-semibold text-text text-xl">Poslední trénink</Text>
			</View>
			<Link
				href={{
					pathname: "/[id]",
					params: { id: workoutId },
				}}
			>
				<View className="w-full flex-row items-center justify-between rounded-xl bg-secondary px-4 py-3">
					<Text className="text-base text-text">
						{format(new Date(workoutDate), "EEEE, dd.MM.yyyy", { locale: cs })}
					</Text>
					<ChevronRight color={COLORS.muted} size={20} />
				</View>
			</Link>
		</View>
	);
}
