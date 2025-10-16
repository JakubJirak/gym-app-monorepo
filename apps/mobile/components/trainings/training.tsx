import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

interface TrainingProps {
	id: string;
	name: string;
	date: string;
	//exercises: number;
	filter: {
		name: string;
		color: string;
	} | null;
}

export default function Training({ id, name, date, filter }: TrainingProps) {
	return (
		<Link
			href={{
				pathname: "/[id]",
				params: { id },
			}}
		>
			<View className="py-6 px-2 flex-row">
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
				<View className="gap-3 flex-1">
					<Text className="text-white text-xl font-semibold">{name}</Text>
					<View className="flex-row gap-2 items-center">
						<Ionicons name="calendar-outline" size={20} color={COLORS.muted} />
						<Text className="text-muted">
							{format(new Date(date), "PPPP", { locale: cs })}
						</Text>
					</View>
				</View>
				<View className="flex-col justify-between">
					<Text
						className={`text-white text-sm border px-2.5 py-1.5 rounded-xl text-center`}
						style={{ borderColor: `${ filter ? `${filter.color}99` : "gray" }` }}
					>
						{filter ? filter.name : "Žádný"}
					</Text>
				</View>
			</View>
		</Link>
	);
}
