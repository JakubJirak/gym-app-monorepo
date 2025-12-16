import { useMutation } from "convex/react";
import { ExercisePicker } from "@/components/forms/exercise-picker";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type EditExerciseProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	routineExerciseId: string;
	closeParent: () => void;
};

export default function EditExerciseModal({ visible, setVisible, routineExerciseId, closeParent }: EditExerciseProps) {
	const closeSheet = () => setVisible(false);
	const editExercise = useMutation(api.routineExercises.editExercise);

	const handleExerciseSelect = (exerciseId: string) => {
		editExercise({
			routineExerciseId: routineExerciseId as Id<"routinesExercises">,
			exerciseId: exerciseId as Id<"exercises">,
		});
		closeSheet();
		closeParent();
	};

	return <ExercisePicker onSelect={handleExerciseSelect} setVisible={setVisible} standalone visible={visible} />;
}
