import { useQuery } from "convex/react";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, type ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";
import AddNewExerciseModal from "../exercises/add-new-exercise";

type Exercise = {
	_id: string;
	name: string;
};

type ExercisePickerProps = {
	selectedId?: string | null;
	onSelect: (id: string) => void;
};

export function ExercisePicker({ selectedId, onSelect }: ExercisePickerProps) {
	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [query, setQuery] = useState("");
	const exercises = useQuery(api.exercises.getAllExercises);
	const inputRef = useRef<TextInput>(null);

	const chosenId = selectedId ?? internalSelectedId;
	const chosenExercise = useMemo(() => exercises?.find((e) => e._id === chosenId) ?? null, [exercises, chosenId]);

	useEffect(() => {
		if (modalVisible) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [modalVisible]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) {
			return exercises;
		}
		return exercises?.filter((e) => (e.name || "").toLowerCase().includes(q));
	}, [query, exercises]);

	function handleSelect(item: Exercise) {
		onSelect(item._id);
		if (selectedId === undefined) {
			setInternalSelectedId(item._id);
		}
		setQuery("");
		Keyboard.dismiss();
		setModalVisible(false);
	}

	const closeModal = () => {
		Keyboard.dismiss();
		setModalVisible(false);
	};

	const renderItem: ListRenderItem<Exercise> = ({ item }) => {
		const selected = item._id === chosenId;
		return (
			<TouchableOpacity
				className={`flex-row items-center justify-between rounded-md px-2 py-3 ${selected && "bg-secondary"}`}
				onPress={() => handleSelect(item)}
			>
				<Text className={`text-base text-white ${selected && "font-bold"}`}>{item.name}</Text>
				{selected ? <Check color="white" size={20} /> : null}
			</TouchableOpacity>
		);
	};

	return (
		<>
			<TouchableOpacity
				accessibilityRole="button"
				className="w-full flex-row items-center justify-between rounded-lg bg-secondary px-4 py-3"
				onPress={() => setModalVisible(true)}
			>
				<View>
					<Text className={`${chosenExercise ? "text-white" : "text-muted"} text-base`}>
						{chosenExercise ? chosenExercise.name : "Vyberte cvik..."}
					</Text>
				</View>
				<ChevronDown color={COLORS.muted} size={20} />
			</TouchableOpacity>

			<Modal
				animationIn="slideInUp"
				animationOut="slideOutDown"
				backdropOpacity={0.5}
				hideModalContentWhileAnimating={true}
				isVisible={modalVisible}
				onBackButtonPress={closeModal}
				onBackdropPress={closeModal}
				onSwipeComplete={closeModal}
				propagateSwipe
				style={{ justifyContent: "flex-end", margin: 0 }}
				swipeDirection={["down"]}
				useNativeDriver
				useNativeDriverForBackdrop
			>
				<View className="h-[90%] rounded-t-xl bg-darker p-4">
					<View className="mb-4 h-1 w-10 self-center rounded-full bg-modalPicker" />
					<View className="mb-3 flex-row items-center justify-between">
						<View className="flex-1">
							<TextInput
								className="rounded-xl bg-secondary px-4 py-3 text-base text-text"
								clearButtonMode="while-editing"
								onChangeText={setQuery}
								placeholder="Hledej cvik..."
								placeholderTextColorClassName="accent-muted"
								ref={inputRef}
								value={query}
							/>
						</View>
					</View>

					<FlatList
						data={filtered}
						keyboardShouldPersistTaps="handled"
						keyExtractor={(item) => item._id}
						ListEmptyComponent={() => <EmptyComponent input={query} />}
						renderItem={renderItem}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</Modal>
		</>
	);
}

const EmptyComponent = ({ input }: { input: string }) => {
	const [sheetVisible, setSheetVisible] = useState(false);
	return (
		<View className="items-center py-4">
			<TouchableOpacity
				className="flex flex-row items-center gap-2 rounded-xl bg-secondary px-4 py-3"
				onPress={() => setSheetVisible(true)}
			>
				<Plus color="white" size={24} />
				<Text className="text-lg text-text">Přidat nový cvik</Text>
			</TouchableOpacity>
			<AddNewExerciseModal
				defaultName={input}
				setSheetVisible={setSheetVisible}
				sheetVisible={sheetVisible}
			/>
		</View>
	);
};
