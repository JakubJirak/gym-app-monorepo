import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
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
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

export function EditFilter({ filterId, defName, defColor }: { filterId: string; defName: string; defColor: string }) {
	const [open, setOpen] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>(defName);
	const [color, setColor] = useState<string>(defColor);
	const editFilter = useMutation(api.filters.editFilter);

	function handleEditFilter() {
		editFilter({
			filterId: filterId as Id<"filters">,
			name: filter,
			color,
		});
		setOpen(false);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleEditFilter();
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<form>
				<DialogTrigger asChild>
					<Button size="icon-sm" variant="outline">
						<Pencil />
					</Button>
				</DialogTrigger>
				<DialogContent className="h-auto sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Úprava kategorie</DialogTitle>
						<DialogDescription>
							Zde můžete upravit kategorii pro vaše tréninky.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<Input
							className="mt-2"
							onChange={(e) => setFilter(e.target.value)}
							required
							type="text"
							value={filter}
						/>
						<div className="mt-4 flex items-center gap-4">
							<p>Vyber barvu:</p>
							<input
								className="cursor-pointer"
								onChange={(e) => setColor(e.target.value)}
								required
								type="color"
								value={color}
							/>
						</div>

						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button variant="outline">Zrušit</Button>
							</DialogClose>
							<Button type="submit">Upravit kategorii</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</form>
		</Dialog>
	);
}
