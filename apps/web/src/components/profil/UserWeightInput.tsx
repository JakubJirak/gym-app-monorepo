import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Check, Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { api } from "../../../../../packages/convex/convex/_generated/api";

const UserWeightInput = () => {
	const { data: session } = authClient.useSession();
	const [weight, setWeight] = useState<string>("");
	const [changeWeight, setChangeWeight] = useState<boolean>(false);

	const { data: weightData } = useSuspenseQuery(convexQuery(api.userWeights.getUserWeight, {}));
	const addWeight = useMutation(api.userWeights.addUserWeight);
	const editWeight = useMutation(api.userWeights.updateUserWeight);

	const handleAddWeight = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		addWeight({ weight });
	};

	const handleChangeWeight = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (weightData?._id !== undefined) {
			await editWeight({ weightId: weightData?._id, changeWeight: weight });
			setChangeWeight(false);
		}
	};

	if (!session) {
		return null;
	}

	if (!weightData) {
		return (
			<div className="p-2">
				<form className="flex items-center gap-2" onSubmit={handleAddWeight}>
					<p>Vaše váha (kg):</p>
					<Input
						className="max-w-[70px]"
						max="500"
						min="10"
						onChange={(e) => setWeight(e.target.value)}
						required
						step="0.01"
						type="number"
						value={weight}
					/>
					<Button className="ml-auto" size="icon" type="submit">
						<Check />
					</Button>
				</form>
			</div>
		);
	}

	return (
		<div className="p-2">
			{changeWeight ? (
				<form className="flex items-center gap-2" onSubmit={handleChangeWeight}>
					<p>Vaše váha (kg):</p>
					<Input
						autoFocus
						className="max-w-[70px]"
						max="500"
						min="10"
						onChange={(e) => setWeight(e.target.value)}
						required
						step="0.01"
						type="number"
						value={weight}
					/>
					<Button className="ml-auto" size="icon" type="submit">
						<Check />
					</Button>
				</form>
			) : (
				<div className="flex items-center gap-2">
					<p>Vaše váha:</p>
					<p>{weightData.weight}kg</p>
					<Button
						className="ml-auto"
						onClick={() => setChangeWeight(true)}
						size="icon"
						type="button"
					>
						<Pencil />
					</Button>
				</div>
			)}
		</div>
	);
};

export default UserWeightInput;
