import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Check, Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";

const UserDescription = () => {
	const [descript, setDescript] = useState<string>("");
	const [changeDescription, setChangeDescription] = useState<boolean>(false);

	const { data: descriptionData } = useSuspenseQuery(convexQuery(api.description.getUserDescription, {}));
	const addDescription = useMutation(api.description.addUserDescription);
	const editDescription = useMutation(api.description.editUserDescription);

	const handleAddWeight = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		addDescription({ description: descript });
	};

	const handleChangeDescription = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (descriptionData?._id !== undefined) {
			await editDescription({ descriptionId: descriptionData?._id, description: descript });
			setChangeDescription(false);
		}
	};

	if (!descriptionData) {
		return (
			<div className="p-2">
				<form className="flex items-center gap-2" onSubmit={handleAddWeight}>
					<p>Váš popis:</p>
					<Input
						autoFocus
						className="max-w-[200px]"
						onChange={(e) => setDescript(e.target.value)}
						required
						value={descript}
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
			{changeDescription ? (
				<form className="flex items-center gap-2" onSubmit={handleChangeDescription}>
					<p>Váš popis:</p>
					<Input
						autoFocus
						className="max-w-[200px]"
						onChange={(e) => setDescript(e.target.value)}
						required
						value={descript}
					/>
					<Button className="ml-auto" size="icon" type="submit">
						<Check />
					</Button>
				</form>
			) : (
				<div className="flex items-center gap-2">
					<p>Váš popis:</p>
					<p>{descriptionData.description}</p>
					<Button
						className="ml-auto"
						onClick={() => setChangeDescription(true)}
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

export default UserDescription;
