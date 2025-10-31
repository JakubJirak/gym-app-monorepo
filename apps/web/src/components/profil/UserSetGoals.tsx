import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Pencil, Target } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";

const UserSetGoals = () => {
	const [squat, setSquat] = useState("");
	const [bench, setBench] = useState("");
	const [deadlift, setDeadlift] = useState("");
	const [edit, setEdit] = useState<boolean>(false);

	const { data: goals } = useSuspenseQuery(convexQuery(api.userGoals.getUserGoals, {}));
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
			<div className="mb-6 flex items-center justify-between">
				<p className="flex items-center gap-3 font-bold">
					<Target />
					Cíle pro Powerlifting (kg)
				</p>
				{goals && (
					<Button onClick={() => setEdit(true)} size="icon">
						<Pencil />
					</Button>
				)}
			</div>
			<div className="px-0">
				{!goals || edit ? (
					<form className="-mt-2 flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
							<p>Squat:</p>
							<Input
								className="max-w-[100px]"
								max="500"
								min="10"
								onChange={(e) => setSquat(e.target.value)}
								required
								step="0.01"
								type="number"
								value={squat}
							/>
						</div>
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
							<p>Bench:</p>
							<Input
								className="max-w-[100px]"
								max="500"
								min="10"
								onChange={(e) => setBench(e.target.value)}
								required
								step="0.01"
								type="number"
								value={bench}
							/>
						</div>
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
							<p>Deadlift:</p>
							<Input
								className="max-w-[100px]"
								max="500"
								min="10"
								onChange={(e) => setDeadlift(e.target.value)}
								required
								step="0.01"
								type="number"
								value={deadlift}
							/>
						</div>
						<Button className="mt-2" type="submit">
							Uložit cíle
						</Button>
					</form>
				) : (
					<div className="-mt-2 flex flex-col gap-3">
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
							<p>Squat:</p>
							<p>{goals.squat}kg</p>
						</div>
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
							<p>Bench:</p>
							<p>{goals.bench}kg</p>
						</div>
						<div className="grid grid-cols-[60px_1fr] items-center gap-2">
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
