import * as React from "react";
import { AddExercise } from "@/components/cviky/AddExercise.tsx";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { Id } from "../../../../../packages/convex/convex/_generated/dataModel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { useMutation } from "convex/react";
import { ExerciseSelect } from "utils/training-types";

interface ExerciseComboboxProps {
	selectedStatus: ExerciseSelect | null;
	setSelectedStatus: (status: ExerciseSelect | null) => void;
	exerciseId: string;
	selectExercise?: (exerciseId: string, selected: ExerciseSelect) => void;
}

export function ExerciseCombobox({
	selectedStatus,
	setSelectedStatus,
	exerciseId,
	selectExercise,
}: ExerciseComboboxProps) {
	const [open, setOpen] = React.useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (selectedStatus && selectExercise) selectExercise(exerciseId, selectedStatus);
	}, [selectedStatus]);

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button variant="outline" className="w-full justify-start" autoFocus>
						{selectedStatus ? <>{selectedStatus.name}</> : <>Vyber cvik</>}
					</Button>
				</DrawerTrigger>
				<DrawerTitle className="hidden">title</DrawerTitle>
				<DrawerDescription className="hidden">description</DrawerDescription>
				<DrawerContent className="h-[70vh] max-h-[50vh]">
					<div className="h-full overflow-auto max-w-[500px] lg:min-w-[500px] lg:mx-auto">
						<StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
					</div>
				</DrawerContent>
			</Drawer>
		</>
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

	if (!exercises) return null;

	return (
		<Command className="w-full">
			<CommandInput
				placeholder="Vyhledej cvik..."
				autoFocus
				value={searchVal}
				onValueChange={(e) => setSearchVal(e)}
			/>
			<CommandList className="max-h-[55vh]">
				<CommandEmpty className="p-4 text-muted-foreground text-sm text-center">
					<AddExercise handleAddExercise={handleAddExercise} defaultName={searchVal} />
				</CommandEmpty>
				<CommandGroup>
					{exercises.map((status) => (
						<CommandItem
							className="text-base p-2"
							key={status.name}
							value={status.name}
							onSelect={(value) => {
								setSelectedStatus(
									exercises.find((priority) => priority.name === value) || null,
								);
								setOpen(false);
							}}
						>
							{status.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
