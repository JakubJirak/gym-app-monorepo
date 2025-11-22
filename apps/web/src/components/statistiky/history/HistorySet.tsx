import type { Id } from "../../../../../../packages/convex/convex/_generated/dataModel";

type setsType =
	| {
			_id: Id<"sets">;
			reps: number;
			weight: number;
			order: number;
	  }[]
	| undefined;

type HistorySetProps = {
	date?: string;
	sets?: setsType;
};

const HistorySet = ({ date, sets }: HistorySetProps) => {
	if (!(date && sets)) {
		return <p>Pro tento cvik nemate zadnou serii</p>;
	}

	const d = new Date(date);

	return (
		<div>
			<h2 className="mb-2 font-bold">{d.toLocaleDateString()}</h2>
			<div>
				<div className="space-y-2">
					{sets.map((set) => (
						<div className="flex gap-0.5 rounded-xl bg-secondary p-2 px-3" key={set._id}>
							<p>{set.order ? set.order + 1 : 1}. série</p>
							<p className="ml-auto font-bold">{set.weight}</p>
							<p className="font-bold">×</p>
							<p className="font-bold">{set.reps}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HistorySet;
