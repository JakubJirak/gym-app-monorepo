import { useMutation } from "convex/react";
import { LoaderCircle, Pencil, Target } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label";
import { api } from "../../../../../packages/convex/convex/_generated/api";

type UserSetGoalsProps = {
	goals: {
		squat: string;
		bench: string;
		deadlift: string;
	} | null;
};

const UserSetGoals = ({ goals }: UserSetGoalsProps) => {
	const [squat, setSquat] = useState(goals?.squat ?? "");
	const [bench, setBench] = useState(goals?.bench ?? "");
	const [deadlift, setDeadlift] = useState(goals?.deadlift ?? "");
	const [isEditing, setIsEditing] = useState(goals === null);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setUserGoals = useMutation(api.profile.setUserGoals);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!(squat && bench && deadlift) || isSaving) {
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			await setUserGoals({ squat, bench, deadlift });
			setIsEditing(false);
		} catch {
			setError("Cíle se nepodařilo uložit.");
		} finally {
			setIsSaving(false);
		}
	};

	const startEditing = () => {
		setSquat(goals?.squat ?? "");
		setBench(goals?.bench ?? "");
		setDeadlift(goals?.deadlift ?? "");
		setError(null);
		setIsEditing(true);
	};

	return (
		<div className="p-2">
			<div className="mb-6 flex items-center justify-between">
				<p className="flex items-center gap-3 font-bold">
					<Target />
					Cíle pro Powerlifting (kg)
				</p>
				{goals && !isEditing && (
					<Button aria-label="Upravit cíle" onClick={startEditing} size="icon">
						<Pencil />
					</Button>
				)}
			</div>

			{!goals || isEditing ? (
				<form className="-mt-2 flex flex-col gap-3" onSubmit={handleSubmit}>
					<GoalInput id="goal-squat" label="Squat" onChange={setSquat} value={squat} />
					<GoalInput id="goal-bench" label="Bench" onChange={setBench} value={bench} />
					<GoalInput id="goal-deadlift" label="Deadlift" onChange={setDeadlift} value={deadlift} />

					{error && <p className="text-destructive text-sm">{error}</p>}

					<Button
						className="mt-2"
						disabled={isSaving || !(squat && bench && deadlift)}
						type="submit"
					>
						{isSaving && <LoaderCircle className="animate-spin" />}
						Uložit cíle
					</Button>
				</form>
			) : (
				<div className="-mt-2 flex flex-col gap-3">
					<GoalValue label="Squat" value={goals.squat} />
					<GoalValue label="Bench" value={goals.bench} />
					<GoalValue label="Deadlift" value={goals.deadlift} />
				</div>
			)}
		</div>
	);
};

type GoalInputProps = {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
};

const GoalInput = ({ id, label, value, onChange }: GoalInputProps) => (
	<div className="grid grid-cols-[70px_1fr] items-center gap-2">
		<Label htmlFor={id}>{label}</Label>
		<Input
			className="max-w-25"
			id={id}
			max="500"
			min="10"
			onChange={(event) => onChange(event.target.value)}
			required
			step="0.01"
			type="number"
			value={value}
		/>
	</div>
);

const GoalValue = ({ label, value }: { label: string; value: string }) => (
	<div className="grid grid-cols-[70px_1fr] items-center gap-2">
		<p>{label}:</p>
		<p>{value} kg</p>
	</div>
);

export default UserSetGoals;
