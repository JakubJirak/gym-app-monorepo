import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Plus, Target } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";

type CreateGoalsProps = {
	sheetName?: string;
};

export default function CreateGoals({ sheetName }: CreateGoalsProps) {
	const sheetId = sheetName ?? NAMES.sheets.createGoals;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
	const [squat, setSquat] = useState("");
	const [bench, setBench] = useState("");
	const [deadlift, setDeadlift] = useState("");

	const squatNum = Number.parseFloat(squat.replace(",", "."));
	const benchNum = Number.parseFloat(bench.replace(",", "."));
	const deadliftNum = Number.parseFloat(deadlift.replace(",", "."));

	const isValidNumber = (num: number) => !Number.isNaN(num) && num > 0 && num <= 1000;

	const disabled = !(isValidNumber(squatNum) && isValidNumber(benchNum) && isValidNumber(deadliftNum));

	const addUserGoals = useMutation(api.userGoals.addUserGoals);

	const handleSave = () => {
		if (squat !== "" || bench !== "" || deadlift !== "") {
			addUserGoals({
				squat,
				bench,
				deadlift,
			});
			setSquat("");
			setBench("");
			setDeadlift("");
			closeSheet();
		}
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.85, 1]}
			dimmedDetentIndex={0.1}
			footer={
				<TouchableOpacity
					className="mx-4 mb-6 flex-row items-center justify-center rounded-2xl py-3"
					disabled={disabled}
					onPress={handleSave}
					style={{
						backgroundColor: disabled ? COLORS.disabled : COLORS.accent,
					}}
				>
					<Plus color="white" size={20} />
					<Text className="px-3 py-1 text-center font-bold text-lg text-text">Přidat cíle</Text>
				</TouchableOpacity>
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Target color="white" size={24} />
						<Text className="font-bold text-text text-xl">Přidat cíle</Text>
					</View>

					<View className="mt-2 gap-4">
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Squat (kg)</Text>
							<TextInput
								autoFocus
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setSquat}
								onSubmitEditing={() => {
									if (!disabled) {
										handleSave();
									}
								}}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								returnKeyType="done"
								value={squat}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Bench (kg)</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setBench}
								onSubmitEditing={() => {
									if (!disabled) {
										handleSave();
									}
								}}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								returnKeyType="done"
								value={bench}
							/>
						</View>
						<View>
							<Text className="mb-2 font-semibold text-lg text-text">Deadlift (kg)</Text>
							<TextInput
								className="h-13 rounded-xl bg-secondary px-3 py-3 text-lg text-text"
								cursorColorClassName="accent-text"
								keyboardType="numeric"
								maxLength={5}
								onChangeText={setDeadlift}
								onSubmitEditing={() => {
									if (!disabled) {
										handleSave();
									}
								}}
								placeholder="0"
								placeholderTextColor={COLORS.muted}
								returnKeyType="done"
								value={deadlift}
							/>
						</View>
					</View>
				</View>
			</View>
		</TrueSheet>
	);
}
