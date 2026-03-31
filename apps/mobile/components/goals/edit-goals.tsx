import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../packages/convex/convex/_generated/dataModel";

type EditGoalsProps = {
	squatDef: string;
	benchDef: string;
	deadliftDef: string;
	goalId: string;
	sheetName?: string;
};

export default function EditGoals({ squatDef, benchDef, deadliftDef, goalId, sheetName }: EditGoalsProps) {
	const sheetId = sheetName ?? NAMES.sheets.editGoals;
	const closeSheet = () => TrueSheet.dismiss(sheetId);
	const [squat, setSquat] = useState(squatDef);
	const [bench, setBench] = useState(benchDef);
	const [deadlift, setDeadlift] = useState(deadliftDef);

	const squatNum = Number.parseFloat(squat.replace(",", "."));
	const benchNum = Number.parseFloat(bench.replace(",", "."));
	const deadliftNum = Number.parseFloat(deadlift.replace(",", "."));

	const isValidNumber = (num: number) => !Number.isNaN(num) && num > 0 && num <= 1000;

	const disabled =
		!(isValidNumber(squatNum) && isValidNumber(benchNum) && isValidNumber(deadliftNum)) ||
		(squat === squatDef && bench === benchDef && deadlift === deadliftDef);

	const updateUserGoals = useMutation(api.userGoals.updateUserGoals);

	useEffect(() => {
		setSquat(squatDef);
		setBench(benchDef);
		setDeadlift(deadliftDef);
	}, [squatDef, benchDef, deadliftDef]);

	const handleSave = () => {
		if (squatDef || benchDef || deadliftDef) {
			updateUserGoals({
				goalId: goalId as Id<"userGoals">,
				squat,
				bench,
				deadlift,
			});
			closeSheet();
		}
	};

	return (
		<TrueSheet
			backgroundColor={COLORS.darker}
			cornerRadius={24}
			detents={[0.8, 1]}
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
					<Pencil color="white" size={20} />
					<Text className="px-3 py-1 text-center font-bold text-lg text-text">Upravit cíle</Text>
				</TouchableOpacity>
			}
			name={sheetId}
		>
			<View className="px-4 pt-8 pb-4">
				<View>
					<View className="mt-2 mb-4 flex-row items-center gap-3 self-center">
						<Pencil color="white" size={20} />
						<Text className="font-bold text-text text-xl">Upravit cíle</Text>
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
