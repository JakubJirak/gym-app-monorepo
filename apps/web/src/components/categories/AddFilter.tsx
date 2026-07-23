import { useMutation } from "convex/react";
import { LoaderCircle, Plus } from "lucide-react";
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
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { api } from "../../../../../packages/convex/convex/_generated/api";

export function AddFilter() {
	const [open, setOpen] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("");
	const [color, setColor] = useState<string>("#000000");
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const addFilter = useMutation(api.filters.addFilter);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const name = filter.trim();
		if (!name || isSaving) {
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			await addFilter({ name, color });
			setFilter("");
			setColor("#000000");
			setOpen(false);
		} catch {
			setError("Kategorii se nepodařilo přidat.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				if (!isSaving) {
					setOpen(nextOpen);
					setError(null);
				}
			}}
			open={open}
		>
			<DialogTrigger asChild>
				<Button size="icon">
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="h-auto sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Přidání kategorie</DialogTitle>
					<DialogDescription>
						Zde můžete přidat novou kategorii pro vaše tréninky.
					</DialogDescription>
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
						<Button disabled={isSaving || !filter.trim()} type="submit">
							{isSaving && <LoaderCircle className="animate-spin" />}
							Přidat kategorii
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
