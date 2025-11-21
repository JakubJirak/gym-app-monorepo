import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import type { ExerciseSelect } from "utils/training-types";
import { AddExercise } from "@/components/cviky/AddExercise.tsx";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import type { Id } from "../../../../../packages/convex/convex/_generated/dataModel";

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
				<Button autoFocus className="w-full justify-start" variant="outline">
					{selectedStatus ? <p>{selectedStatus.name}</p> : <>Vyber cvik</>}
				</Button>
			</DrawerTrigger>
			<DrawerTitle className="hidden">title</DrawerTitle>
			<DrawerDescription className="hidden">description</DrawerDescription>
			<DrawerContent className="h-[70vh] max-h-[50vh]">
				<div className="h-full max-w-[500px] overflow-auto lg:mx-auto lg:min-w-[500px]">
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
	const { data: exercises } = useSuspenseQuery(convexQuery(api.exercises.getAllExercises, {}));
	const addExercise = useMutation(api.exercises.addExercise);

	const handleAddExercise = (exerciseName: string, muscleGroupId: Id<"muscleGroups">) => {
		addExercise({
			name: exerciseName,
			muscleGroupId,
		});
	};

	if (!exercises) {
		return null;
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
					<AddExercise defaultName={searchVal} handleAddExercise={handleAddExercise} />
				</CommandEmpty>
				<CommandGroup>
					{exercises.map((status) => (
						<CommandItem
							className="p-2 text-base"
							key={status.name}
							onSelect={(value) => {
								setSelectedStatus(
									exercises.find((priority) => priority.name === value) || null
								);
								setOpen(false);
							}}
							value={status.name}
						>
							{status.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
