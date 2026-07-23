import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { FilterSummary } from "./category";

type EditFilterProps = {
	filter: FilterSummary;
	onClose: () => void;
};

export function EditFilter({ filter: initialFilter, onClose }: EditFilterProps) {
	const [filter, setFilter] = useState(initialFilter.name);
	const [color, setColor] = useState(initialFilter.color);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const editFilter = useMutation(api.filters.editFilter);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const name = filter.trim();
		if (!name || isSaving) {
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			await editFilter({
				filterId: initialFilter._id,
				name,
				color,
			});
		} catch {
			setError("Kategorii se nepodařilo upravit.");
			setIsSaving(false);
			return;
		}

		setIsSaving(false);
		onClose();
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!(open || isSaving)) {
					onClose();
				}
			}}
			open
		>
			<DialogContent className="h-auto sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Úprava kategorie</DialogTitle>
					<DialogDescription>Zde můžete upravit kategorii pro vaše tréninky.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<Input
						aria-label="Název kategorie"
						autoFocus
						className="mt-2"
						maxLength={50}
						onChange={(e) => setFilter(e.target.value)}
						required
						type="text"
						value={filter}
					/>
					<div className="mt-4 flex items-center gap-4">
						<p>Vyber barvu:</p>
						<input
							aria-label="Barva kategorie"
							className="cursor-pointer"
							onChange={(e) => setColor(e.target.value)}
							required
							type="color"
							value={color}
						/>
					</div>

					{error && <p className="mt-4 text-destructive text-sm">{error}</p>}

					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button disabled={isSaving} type="button" variant="outline">
								Zrušit
							</Button>
						</DialogClose>
						<Button
							disabled={
								isSaving ||
								!filter.trim() ||
								(filter.trim() === initialFilter.name && color === initialFilter.color)
							}
							type="submit"
						>
							{isSaving && <LoaderCircle className="animate-spin" />}
							Upravit kategorii
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
