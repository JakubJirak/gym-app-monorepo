import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type TrainingProps = {
	id: string;
	name: string;
	date: string;
	//exercises: number;
	filter: {
		name: string;
		color: string;
	} | null;
};

export default function Training({ id, name, date, filter }: TrainingProps) {
	return (
		<Link
			href={{
				pathname: "/[id]",
				params: { id },
			}}
		>
			<View className="flex-row px-2 py-6">
				<View
					// className={`w-[3px] h-full rounded-lg mr-6 bg-[${filter.color}]/60`}
					style={{
						backgroundColor: `${filter ? filter.color : "gray"}`,
						width: 3,
						height: "100%",
						borderRadius: 8,
						marginRight: 24,
						opacity: 0.8,
					}}
				/>
				<View className="flex-1 gap-1">
					<Text className="font-semibold text-lg text-text">{name}</Text>
					<View className="flex-row items-center gap-2">
						<Ionicons color={COLORS.muted} name="calendar-outline" size={20} />
						<Text className="text-muted">{format(new Date(date), "PPPP", { locale: cs })}</Text>
					</View>
				</View>
				<View className="flex-col justify-between">
					<Text
						className={
							"rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
						}
						style={{ borderColor: `${filter ? `${filter.color}99` : "gray"}` }}
					>
						{filter ? filter.name : "Žádný"}
					</Text>
				</View>
			</View>
		</Link>
	);
}
