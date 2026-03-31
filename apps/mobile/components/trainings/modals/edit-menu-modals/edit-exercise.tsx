import { useMutation } from "convex/react";
import { ExercisePicker } from "@/components/forms/exercise-picker";
import { NAMES } from "@/constants/NAMES";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	workoutExerciseId: string;
	closeParent: () => void;
};

export default function EditExerciseModal({ visible, setVisible, workoutExerciseId, closeParent }: EditExerciseProps) {
	const closeSheet = () => setVisible(false);
	const editExercise = useMutation(api.workoutExercises.editExercise);
	const pickerSheetName = `${NAMES.sheets.exercisePicker}-training-edit-${workoutExerciseId}`;

	const handleExerciseSelect = (exerciseId: string) => {
		editExercise({
			workoutExerciseId: workoutExerciseId as Id<"workoutExercises">,
			exerciseId: exerciseId as Id<"exercises">,
		});
		closeSheet();
		closeParent();
	};

	return (
		<ExercisePicker
			onSelect={handleExerciseSelect}
			setVisible={setVisible}
			sheetName={pickerSheetName}
			standalone
			visible={visible}
		/>
	);
}
