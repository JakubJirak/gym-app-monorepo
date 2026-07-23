import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { History, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ExerciseCombobox } from "@/components/treninky/ExerciseCombobox.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import type { ExerciseSelect } from "../../../../utils/training-types";
import ChartFirstSets from "./ChartFirstSets";
import HistorySet from "./HistorySet";

const HistorySets = () => {
	const [selectedStatusesEx, setSelectedStatusesEx] = useState<ExerciseSelect | null>(null);
	const { data: history, isPending } = useQuery(
		convexQuery(
			api.stats.getExerciseHistory,
			selectedStatusesEx ? { exerciseId: selectedStatusesEx._id } : "skip"
		)
	);

	return (
		<div className="space-y-4 p-1">
			<div>
				<p className="flex items-center gap-3 pb-4 font-bold text-lg">
					<History />
					Historie cviku
				</p>

				<ExerciseCombobox
					exerciseId="a"
					selectedStatus={selectedStatusesEx}
					setSelectedStatus={setSelectedStatusesEx}
				/>
			</div>

			{selectedStatusesEx && (
				<>
					{isPending && (
						<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
							<LoaderCircle className="h-5 w-5 animate-spin" />
							<span>Načítám historii…</span>
						</div>
					)}

					{history && (
						<>
							<ChartFirstSets chartData={history.chart} />

							<Card>
								<CardContent className="px-4">
									{history.entries.length === 0 && (
										<p className="text-center text-muted-foreground">
											Pro tento cvik nemáte žádnou sérii
										</p>
									)}
									<ScrollArea className="max-h-100 overflow-y-auto">
										<div>
											{history.entries.map((entry, index) => (
												<div key={entry.workoutId}>
													<HistorySet
														date={entry.date}
														sets={entry.sets}
													/>
													{index !== history.entries.length - 1 && (
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
				</>
			)}
		</div>
	);
};

export default HistorySets;
