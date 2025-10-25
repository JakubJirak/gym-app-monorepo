import { ExerciseCombobox } from "@/components/treninky/ExerciseCombobox.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useState } from "react";
import { ExerciseSelect } from "utils/training-types";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import HistorySet from "./HistorySet";
import ChartFirstSets from "./ChartFirstSets";

const HistorySets = () => {
	const [selectedStatusesEx, setSelectedStatusesEx] =
		useState<ExerciseSelect | null>(null);
	const { data: trainings } = useSuspenseQuery(
		convexQuery(api.workouts.getUserWorkouts, {}),
	);

	const getHistoryOfSetsById = (id: string) => {
		return trainings
			?.map((training) => {
				const cvik = training.exercises?.find((e) => e.exercise?._id === id);
				if (cvik) {
					return {
						id: training._id,
						date: training.workoutDate,
						sets: cvik.sets,
					};
				}
				return null;
			})
			.filter(Boolean);
	};

	const historySets = getHistoryOfSetsById(selectedStatusesEx?._id ?? "");

	return (
		<div className="space-y-4 p-1">
			<div>
				<p className="flex gap-3 items-center text-lg font-bold pb-4">
					<History />
					Historie cviku
				</p>

				<ExerciseCombobox
					selectedStatus={selectedStatusesEx}
					setSelectedStatus={setSelectedStatusesEx}
					exerciseId="a"
				/>
			</div>

			{selectedStatusesEx && (
				<>
					<ChartFirstSets historySets={historySets} />

					<Card>
						<CardContent className="px-4">
							{historySets?.length === 0 && (
								<p className="text-center text-muted-foreground">
									Pro tento cvik nemáte žádnou sérii
								</p>
							)}
							{/*@ts-ignore */}
							<ScrollArea className="max-h-100 overflow-y-auto">
								<div>
									{historySets?.map((history, index) => (
										<div key={history?.id}>
											<HistorySet date={history?.date} sets={history?.sets} />
											{index !== historySets.length - 1 && (
												<Separator className="my-3" />
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default HistorySets;
