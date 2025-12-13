import { useRouter } from "expo-router";
import { Pencil, Trash } from "lucide-react-native";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import DeleteRoutineModal from "./modals/delete-routine";
import EditRoutineModal from "./modals/edit-routine-modal";

type RoutineProps = {
	name: string;
	color: string | undefined;
	filterName: string | undefined;
	filterId: string | undefined;
	id: string;
};
export default function Routine({ name, color, filterName, filterId, id }: RoutineProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const [deleteVisible, setDeleteVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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
			setMenuPosition({ x: x + width - 280, y });
			setMenuVisible(true);
		});
	};

	const closeMenu = () => setMenuVisible(false);

	const handleEdit = () => {
		closeMenu();
		setEditVisible(true);
	};

	const handleDelete = () => {
		closeMenu();
		setDeleteVisible(true);
	};

	return (
		<>
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
							className={
								"rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
							}
							style={{ borderColor: `${color ? `${color}99` : "gray"}` }}
						>
							{filterName ? filterName : "Žádný"}
						</Text>
					</View>
				</View>
			</TouchableOpacity>

			<Modal
				animationIn="fadeIn"
				animationOut="fadeOut"
				backdropOpacity={0.5}
				backdropTransitionOutTiming={0}
				hideModalContentWhileAnimating
				isVisible={menuVisible}
				onBackButtonPress={closeMenu}
				onBackdropPress={closeMenu}
				style={{
					margin: 0,
					position: "absolute",
					left: menuPosition.x,
					top: menuPosition.y + 50,
				}}
				useNativeDriver
				useNativeDriverForBackdrop
			>
				<View className="gap-2 rounded-xl bg-darker p-5">
					<TouchableOpacity className="flex-row items-center gap-3 rounded-lg" onPress={handleEdit}>
						<Pencil color="white" size={18} />
						<Text className="text-lg text-text">Upravit rutinu</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="mt-2 flex-row items-center gap-3 rounded-lg"
						onPress={handleDelete}
					>
						<Trash color={COLORS.destructive} size={18} />
						<Text className="text-destructive text-lg">Smazat rutinu</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<EditRoutineModal
				defaultFilterId={filterId}
				defaultName={name}
				routineId={id}
				setSheetVisible={setEditVisible}
				sheetVisible={editVisible}
			/>

			<DeleteRoutineModal routineId={id} setSheetVisible={setDeleteVisible} sheetVisible={deleteVisible} />
		</>
	);
}
