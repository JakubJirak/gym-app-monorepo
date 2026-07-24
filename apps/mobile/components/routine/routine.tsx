import { useRouter } from "expo-router";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type RoutineProps = {
	name: string;
	color: string | undefined;
	filterName: string | undefined;
	id: string;
	onLongPress: (position: { x: number; y: number }) => void;
};
export default function Routine({ name, color, filterName, id, onLongPress }: RoutineProps) {
	const routineRef = useRef<View>(null);
	const router = useRouter();

	const handlePress = () => {
		router.push({
			pathname: "/rutiny/[id]",
			params: { id },
		});
	};

	const handleLongPress = () => {
		routineRef.current?.measureInWindow((x, y, width) => {
			onLongPress({ x: x + width - 280, y });
		});
	};

	return (
		<TouchableOpacity activeOpacity={0.7} onLongPress={handleLongPress} onPress={handlePress}>
			<View className="flex-row items-center px-2 py-6" ref={routineRef}>
				<View
					style={{
						backgroundColor: `${color ? color : "gray"}`,
						width: 3,
						height: "100%",
						borderRadius: 8,
						marginRight: 24,
						opacity: 0.8,
					}}
				/>
				<View className="flex-1 gap-1">
					<Text className="font-semibold text-lg text-text">{name}</Text>
				</View>
				<View className="flex-col justify-between">
					<Text
						className="rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
						style={{ borderColor: `${color ? `${color}99` : "gray"}` }}
					>
						{filterName ? filterName : "Žádný"}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
