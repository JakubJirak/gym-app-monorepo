import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "convex/react";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, type ListRenderItem, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import AddNewExerciseModal from "../exercises/add-new-exercise";

type Exercise = {
	_id: string;
	name: string;
};

const EmptyComponent = ({
	addExerciseSheetName,
	input,
	onExerciseCreated,
}: {
	addExerciseSheetName: string;
	input: string;
	onExerciseCreated: (exerciseId: string) => void;
}) => (
	<View className="items-center py-4">
		<TouchableOpacity
			className="flex flex-row items-center gap-2 rounded-xl bg-secondary px-4 py-3"
			onPress={() => {
				TrueSheet.present(addExerciseSheetName).catch(() => null);
			}}
		>
			<Plus color="white" size={24} />
			<Text className="text-lg text-text">Přidat nový cvik</Text>
		</TouchableOpacity>
		<AddNewExerciseModal
			defaultName={input}
			onExerciseCreated={onExerciseCreated}
			sheetName={addExerciseSheetName}
		/>
	</View>
);

type ExercisePickerProps = {
	selectedId?: string | null;
	onSelect: (id: string) => void;
	standalone?: boolean;
	visible?: boolean;
	setVisible?: (visible: boolean) => void;
	sheetName?: string;
};

export function ExercisePicker({
	selectedId,
	onSelect,
	standalone = false,
	visible,
	setVisible,
	sheetName,
}: ExercisePickerProps) {
	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
	const [internalModalVisible, setInternalModalVisible] = useState(false);
	const [isPresented, setIsPresented] = useState(false);
	const modalVisible = standalone && visible !== undefined ? visible : internalModalVisible;
	const setModalVisible = standalone && setVisible !== undefined ? setVisible : setInternalModalVisible;
	const pickerSheetName = sheetName ?? NAMES.sheets.exercisePicker;
	const addExerciseSheetName = `${pickerSheetName}-${NAMES.sheets.addNewExerciseFromPicker}`;
	const [query, setQuery] = useState("");
	const exercises = useQuery(api.exercises.getAllExercises);

	const chosenId = standalone ? null : (selectedId ?? internalSelectedId);
	const chosenExercise = useMemo(() => exercises?.find((e) => e._id === chosenId) ?? null, [exercises, chosenId]);

	useEffect(() => {
		if (modalVisible && !isPresented) {
			TrueSheet.present(pickerSheetName).catch(() => null);
			setIsPresented(true);
		}
		if (!modalVisible && isPresented) {
			TrueSheet.dismiss(pickerSheetName).catch(() => null);
			setIsPresented(false);
		}
	}, [isPresented, modalVisible, pickerSheetName]);

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
		closeModal();
	}

	const closeModal = () => {
		TrueSheet.dismiss(pickerSheetName).catch(() => null);
		setIsPresented(false);
		setModalVisible(false);
	};

	const handleDidDismiss = () => {
		setIsPresented(false);
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

	const sheetContent = (
		<View className="flex-1 p-4 pt-8">
			<View className="mb-3 flex-row items-center justify-between">
				<View className="flex-1">
					<TextInput
						autoFocus
						className="rounded-xl bg-secondary px-4 py-3 text-base text-text"
						clearButtonMode="while-editing"
						onChangeText={setQuery}
						placeholder="Hledej cvik..."
						placeholderTextColorClassName="accent-muted"
						value={query}
					/>
				</View>
			</View>

			<FlatList
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 12 }}
				data={filtered}
				keyboardShouldPersistTaps="handled"
				keyExtractor={(item) => item._id}
				ListEmptyComponent={() => (
					<EmptyComponent
						addExerciseSheetName={addExerciseSheetName}
						input={query}
						onExerciseCreated={(exerciseId) => {
							onSelect(exerciseId);
							if (selectedId === undefined) {
								setInternalSelectedId(exerciseId);
							}
							setQuery("");
							closeModal();
						}}
					/>
				)}
				nestedScrollEnabled
				renderItem={renderItem}
				scrollEnabled
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);

	if (standalone) {
		return (
			<TrueSheet
				backgroundColor={COLORS.darker}
				cornerRadius={24}
				detents={[0.7, 1]}
				dimmedDetentIndex={0.1}
				name={pickerSheetName}
				onDidDismiss={handleDidDismiss}
				scrollable
			>
				{sheetContent}
			</TrueSheet>
		);
	}

	return (
		<>
			<TouchableOpacity
				accessibilityRole="button"
				className="w-full flex-row items-center justify-between rounded-lg bg-secondary px-4 py-3"
				onPress={() => {
					setModalVisible(true);
					TrueSheet.present(pickerSheetName).catch(() => null);
					setIsPresented(true);
				}}
			>
				<View>
					<Text className={`${chosenExercise ? "text-white" : "text-muted"} text-base`}>
						{chosenExercise ? chosenExercise.name : "Vyberte cvik..."}
					</Text>
				</View>
				<ChevronDown color={COLORS.muted} size={20} />
			</TouchableOpacity>
			<TrueSheet
				backgroundColor={COLORS.darker}
				cornerRadius={24}
				detents={[0.7, 1]}
				dimmedDetentIndex={0.1}
				name={pickerSheetName}
				onDidDismiss={handleDidDismiss}
				scrollable
			>
				{sheetContent}
			</TrueSheet>
		</>
	);
}
