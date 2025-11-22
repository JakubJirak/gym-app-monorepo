import { Progress } from "@/components/ui/progress.tsx";

type PowerliftingGoalProps = {
	title: string;
	goal: string;
	value: number;
};

const PowerliftingGoal = ({ title, goal, value }: PowerliftingGoalProps) => (
	<div>
		<div className="mb-2 flex justify-between">
			<p className="text-muted-foreground">
				{title} ({goal}kg)
			</p>
			<p>{value}%</p>
		</div>

		<Progress value={value} />
	</div>
);

export default PowerliftingGoal;
