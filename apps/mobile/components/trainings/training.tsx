import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useRouter } from "expo-router";
import { NotebookPen, Pencil, Trash } from "lucide-react-native";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import DeleteTrainingModal from "./modals/delete-training";
import EditTrainingModal from "./modals/edit-training";

type TrainingProps = {
	id: string;
	note: string;
	date: string;
	filter: {
		_id: string;
		name: string;
		color: string;
	} | null;
};

export default function Training({ id, note, date, filter }: TrainingProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const [deleteVisible, setDeleteVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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
							className={
								"rounded-full border px-2.5 py-1.5 text-center font-light text-sm text-text"
							}
							style={{ borderColor: `${filter ? `${filter.color}99` : "gray"}` }}
						>
							{filter ? filter.name : "Žádný"}
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
						<Text className="text-lg text-text">Upravit trénink</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="mt-2 flex-row items-center gap-3 rounded-lg"
						onPress={handleDelete}
					>
						<Trash color={COLORS.destructive} size={18} />
						<Text className="text-destructive text-lg">Smazat trénink</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<EditTrainingModal
				defaultDate={date}
				defaultFilterId={filter?._id}
				defaultName={note}
				setSheetVisible={setEditVisible}
				sheetVisible={editVisible}
				trainingId={id}
			/>

			<DeleteTrainingModal
				setSheetVisible={setDeleteVisible}
				sheetVisible={deleteVisible}
				trainingId={id}
			/>
		</>
	);
}
