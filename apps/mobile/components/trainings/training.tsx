import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useRouter } from "expo-router";
import { NotebookPen } from "lucide-react-native";
import { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";

type TrainingProps = {
	id: string;
	note: string;
	date: string;
	filter: {
		_id: string;
		name: string;
		color: string;
	} | null;
	onLongPress: (position: { x: number; y: number }) => void;
};

function Training({ id, note, date, filter, onLongPress }: TrainingProps) {
	const trainingRef = useRef<View>(null);
	const router = useRouter();

	const handlePress = () => {
		router.push({
			pathname: "/training/[id]",
			params: { id },
		});
	};

	const handleLongPress = () => {
		trainingRef.current?.measureInWindow((x, y, width) => {
			onLongPress({ x: x + width - 280, y });
		});
	};

	return (
		<TouchableOpacity activeOpacity={0.7} onLongPress={handleLongPress} onPress={handlePress}>
			<View className="flex-row items-center px-2 py-6" ref={trainingRef}>
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
						className="rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
						style={{ borderColor: `${filter ? `${filter.color}99` : "gray"}` }}
					>
						{filter ? filter.name : "Žádný"}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default memo(Training);
