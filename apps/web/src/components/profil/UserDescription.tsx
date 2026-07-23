import { useMutation } from "convex/react";
import { Check, LoaderCircle, Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label";
import { api } from "../../../../../packages/convex/convex/_generated/api";

type UserDescriptionProps = {
	description: {
		value: string;
	} | null;
};

const UserDescription = ({ description }: UserDescriptionProps) => {
	const [value, setValue] = useState(description?.value ?? "");
	const [isEditing, setIsEditing] = useState(description === null);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const setDescription = useMutation(api.profile.setUserDescription);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const normalizedValue = value.trim();
		if (!normalizedValue || isSaving) {
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			await setDescription({ description: normalizedValue });
			setValue(normalizedValue);
			setIsEditing(false);
		} catch {
			setError("Popis se nepodařilo uložit.");
		} finally {
			setIsSaving(false);
		}
	};

	const startEditing = () => {
		setValue(description?.value ?? "");
		setError(null);
		setIsEditing(true);
	};

	if (!description || isEditing) {
		return (
			<div className="p-2">
				<form className="flex flex-wrap items-end gap-2" onSubmit={handleSubmit}>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<Label htmlFor="profile-description">Váš popis</Label>
						<Input
							autoFocus
							id="profile-description"
							maxLength={200}
							onChange={(event) => setValue(event.target.value)}
							required
							value={value}
						/>
					</div>
					<Button
						aria-label="Uložit popis"
						disabled={isSaving || !value.trim()}
						size="icon"
						type="submit"
					>
						{isSaving ? <LoaderCircle className="animate-spin" /> : <Check />}
					</Button>
					{error && <p className="w-full text-destructive text-sm">{error}</p>}
				</form>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 p-2">
			<div className="min-w-0 flex-1">
				<p className="text-muted-foreground text-sm">Váš popis</p>
				<p className="break-words">{description.value}</p>
			</div>
			<Button aria-label="Upravit popis" onClick={startEditing} size="icon" type="button">
				<Pencil />
			</Button>
		</div>
	);
};

export default UserDescription;
