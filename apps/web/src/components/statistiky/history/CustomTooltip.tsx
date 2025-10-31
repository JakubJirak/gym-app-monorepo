import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
	if (active && payload && payload.length) {
		const d = new Date(label);
		return (
			<div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background p-3">
				<p className="font-semibold">{d.toLocaleDateString()}</p>
				<div className="flex gap-0.5">
					<p className="ml-auto font-bold">{payload[0].value}kg</p>
					<p className="font-bold">×</p>
					<p className="font-bold">{payload[0].payload.reps}</p>
				</div>
			</div>
		);
	}
	return null;
}
