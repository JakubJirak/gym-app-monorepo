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
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { api } from "../../../../../packages/convex/convex/_generated/api";

export function AddFilter() {
	const [open, setOpen] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>("");
	const [color, setColor] = useState<string>("#000000");
	const addFilter = useMutation(api.filters.addFilter);

	function handleAddFilter(filter: string) {
		addFilter({
			name: filter,
			color,
		});
		setOpen(false);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleAddFilter(filter);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<form>
				<DialogTrigger asChild>
					<Button size="icon">
						<Plus />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] h-auto">
					<DialogHeader>
						<DialogTitle>Přidání kategorie</DialogTitle>
						<DialogDescription>
							Zde můžete přidat novou kategorii pro vaše tréninky.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<Input
							type="text"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="mt-2"
							required
						/>
						<div className="flex items-center mt-4 gap-4">
							<p>Vyber barvu:</p>
							<input
								type="color"
								required
								onChange={(e) => setColor(e.target.value)}
								value={color}
								className="cursor-pointer"
							/>
						</div>

						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button variant="outline">Zrušit</Button>
							</DialogClose>
							<Button type="submit">Přidat kategorii</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</form>
		</Dialog>
	);
}
