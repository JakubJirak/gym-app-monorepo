import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AddExercise } from "@/components/cviky/AddExercise.tsx";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { ExerciseSelect } from "../../../utils/training-types";

type ExerciseComboboxProps = {
	selectedStatus: ExerciseSelect | null;
	setSelectedStatus: (status: ExerciseSelect | null) => void;
	exerciseId: string;
	selectExercise?: (exerciseId: string, selected: ExerciseSelect) => void;
};

export function ExerciseCombobox({
	selectedStatus,
	setSelectedStatus,
	exerciseId,
	selectExercise,
}: ExerciseComboboxProps) {
	const [open, setOpen] = React.useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only once
	useEffect(() => {
		if (selectedStatus && selectExercise) {
			selectExercise(exerciseId, selectedStatus);
		}
	}, [selectedStatus]);

	return (
		<Drawer onOpenChange={setOpen} open={open}>
			<DrawerTrigger asChild>
				<Button autoFocus className="w-full justify-start" type="button" variant="outline">
					{selectedStatus ? <p>{selectedStatus.name}</p> : <>Vyber cvik</>}
				</Button>
			</DrawerTrigger>
			<DrawerTitle className="hidden">title</DrawerTitle>
			<DrawerDescription className="hidden">description</DrawerDescription>
			<DrawerContent className="h-[70vh] max-h-[50vh]">
				<div className="h-full max-w-125 overflow-auto lg:mx-auto lg:min-w-125">
					<StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function StatusList({
	setOpen,
	setSelectedStatus,
}: {
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: ExerciseSelect | null) => void;
}) {
	const [searchVal, setSearchVal] = useState<string>("");
	const { data: exercises, isError, isPending } = useQuery(convexQuery(api.exercises.getAllExercises, {}));

	if (isPending) {
		return (
			<div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
				<LoaderCircle className="h-5 w-5 animate-spin" />
				<span>Načítám cviky…</span>
			</div>
		);
	}

	if (isError || !exercises) {
		return <p className="p-4 text-center text-destructive">Cviky se nepodařilo načíst.</p>;
	}

	return (
		<Command className="w-full">
			<CommandInput
				autoFocus
				onValueChange={(e) => setSearchVal(e)}
				placeholder="Vyhledej cvik..."
				value={searchVal}
			/>
			<CommandList className="max-h-[55vh]">
				<CommandEmpty className="p-4 text-center text-muted-foreground text-sm">
					<AddExercise defaultName={searchVal} />
				</CommandEmpty>
				<CommandGroup>
					{exercises.map((status) => (
						<CommandItem
							className="p-2 text-base"
							key={status._id}
							keywords={[status.name]}
							onSelect={() => {
								setSelectedStatus(status);
								setOpen(false);
							}}
							value={status._id}
						>
							{status.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
