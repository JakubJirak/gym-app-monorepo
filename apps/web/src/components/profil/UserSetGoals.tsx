import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Pencil, Target } from "lucide-react";
import { type FormEvent, useState } from "react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";

const UserSetGoals = () => {
	const [squat, setSquat] = useState("");
	const [bench, setBench] = useState("");
	const [deadlift, setDeadlift] = useState("");
	const [edit, setEdit] = useState<boolean>(false);

	const { data: goals } = useSuspenseQuery(
		convexQuery(api.userGoals.getUserGoals, {}),
	);
	const addGoals = useMutation(api.userGoals.addUserGoals);
	const updateGoals = useMutation(api.userGoals.updateUserGoals);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (edit) {
			if (goals) {
				updateGoals({
					goalId: goals._id,
					squat,
					bench,
					deadlift,
				});
			}
		} else {
			addGoals({
				squat,
				bench,
				deadlift,
			});
		}

		setEdit(false);
		setSquat("");
		setBench("");
		setDeadlift("");
	};

	return (
		<div className="p-2">
			<div className="flex justify-between items-center mb-6">
				<p className="flex gap-3 font-bold items-center">
					<Target />
					Cíle pro Powerlifting (kg)
				</p>
				{goals && (
					<Button size="icon" onClick={() => setEdit(true)}>
						<Pencil />
					</Button>
				)}
			</div>
			<div className="px-0">
				{!goals || edit ? (
					<form
						className="flex flex-col gap-3 -mt-2"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Squat:</p>
							<Input
								value={squat}
								onChange={(e) => setSquat(e.target.value)}
								className="max-w-[100px]"
								type="number"
								min="10"
								max="500"
								step="0.01"
								required
							/>
						</div>
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Bench:</p>
							<Input
								value={bench}
								onChange={(e) => setBench(e.target.value)}
								className="max-w-[100px]"
								type="number"
								min="10"
								max="500"
								step="0.01"
								required
							/>
						</div>
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Deadlift:</p>
							<Input
								value={deadlift}
								onChange={(e) => setDeadlift(e.target.value)}
								className="max-w-[100px]"
								type="number"
								min="10"
								max="500"
								step="0.01"
								required
							/>
						</div>
						<Button className="mt-2" type="submit">
							Uložit cíle
						</Button>
					</form>
				) : (
					<div className="flex flex-col gap-3 -mt-2">
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Squat:</p>
							<p>{goals.squat}kg</p>
						</div>
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Bench:</p>
							<p>{goals.bench}kg</p>
						</div>
						<div className="grid grid-cols-[60px_1fr] gap-2 items-center">
							<p>Deadlift:</p>
							<p>{goals.deadlift}kg</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserSetGoals;
