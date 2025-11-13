import { useMutation } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type AddSetProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	exerciseId: string;
	closeParent: () => void;
	setsLength: number | undefined;
};

export default function AddSetModal({ visible, setVisible, exerciseId, closeParent, setsLength }: AddSetProps) {
	const closeSheet = () => setVisible(false);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const addSet = useMutation(api.workoutExercises.addSet);

	const disabled = weight === "" || reps === "";

	const handleAddSet = () => {
		if (weight !== "" && reps !== "") {
			addSet({
				workoutExerciseId: exerciseId as Id<"workoutExercises">,
				weight: Number(weight),
				reps: Number(reps),
				order: setsLength ? setsLength : 0,
			});
		}
		console.log(exerciseId);
		closeParent();
		closeSheet();
		setWeight("");
		setReps("");
	};

	return (
		<Modal
			animationIn="slideInUp"
			animationOut="slideOutDown"
			isVisible={visible}
			onBackButtonPress={closeSheet}
			onBackdropPress={closeSheet}
			onSwipeComplete={closeSheet}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
		>
			<View className="h-[63%] rounded-t-xl bg-darker p-4">
				<View className="mb-2 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View className="flex-1">
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Plus color="white" size={24} />
						<Text className="font-semibold text-text text-xl">Přidat sérii {setsLength}</Text>
					</View>

					<View className="mt-2 gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Váha</Text>
							<TextInput
								autoFocus
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								onChangeText={setWeight}
								value={weight}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Počet opakování</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								onChangeText={setReps}
								value={reps}
							/>
						</View>
					</View>

					<View className="mt-8 mb-6 flex-row">
						<TouchableOpacity
							className="mr-4 flex w-[35%] items-center justify-center rounded-xl border border-border"
							onPress={closeSheet}
						>
							<Text className="p-2 text-lg text-text">Zrušit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex w-[60%] flex-row items-center justify-center rounded-xl"
							disabled={disabled}
							onPress={handleAddSet}
							style={{
								backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
							}}
						>
							<Plus color="white" size={20} />
							<Text className="p-2 font-semibold text-lg text-text">Přidat sérii</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
