import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { api } from "../../../../../packages/convex/convex/_generated/api";

export type FilterSummary = (typeof api.filters.getFilterSummaries)["_returnType"][number];

type CategoryProps = {
	filter: FilterSummary;
	onEdit: (filter: FilterSummary) => void;
};

const Category = ({ filter, onEdit }: CategoryProps) => (
	<div className="flex items-center gap-4 rounded-xl bg-secondary px-3 py-2.5">
		<div className="size-4 rounded-xl" style={{ backgroundColor: filter.color }} />
		<p className="text-lg">{filter.name}</p>
		<div className="ml-auto">
			<Button
				aria-label={`Upravit kategorii ${filter.name}`}
				onClick={() => onEdit(filter)}
				size="icon-sm"
				variant="outline"
			>
				<Pencil />
			</Button>
		</div>
	</div>
);

export default Category;
