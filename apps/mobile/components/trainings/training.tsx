import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Link } from "expo-router";
import { NotebookPen } from "lucide-react-native";
import { Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type TrainingProps = {
	id: string;
	note: string;
	date: string;
	//exercises: number;
	filter: {
		name: string;
		color: string;
	} | null;
};

export default function Training({ id, note, date, filter }: TrainingProps) {
	return (
		<Link
			href={{
				pathname: "/[id]",
				params: { id },
			}}
		>
			<View className="flex-row items-center px-2 py-6">
				<View
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
					<Text className="font-semibold text-lg text-text">
						{format(new Date(date), "EEEE, dd.MM.yyyy", { locale: cs })}
					</Text>
					{note !== "" && (
						<View className="max-w-[90%] flex-row items-center gap-2">
							<NotebookPen color={COLORS.muted} size={16} />
							<Text className="text-muted">{note}</Text>
						</View>
					)}
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
