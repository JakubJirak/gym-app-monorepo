import Header from "@/components/Header";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { TableProperties } from "lucide-react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import Category from "@/components/categories/category";
import { AddFilter } from "@/components/categories/AddFilter";

export const Route = createFileRoute("/_auth/kategorie/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Kategorie | GYM APPLICATION" },
			{
				name: "description",
				content: "Seznam všech kategorií uživatelů.",
			},
		],
	}),
});

function RouteComponent() {
	const filters = useQuery(api.filters.getAllFilters);

	if (!filters) return null;

	return (
		<div className="pb-8">
			<Header page="KATEGORIE" />
			<div className="max-w-[500px] mx-auto w-[90%] space-y-4 pb-8">
				<div className="flex justify-between items-center mb-4 pl-1">
					<div className="">
						<h2 className="font-semibold text-lg flex gap-2 items-center mb-1">
							<TableProperties size={20} />
							Vaše kategorie
						</h2>
						<p className="text-muted-foreground text-sm">
							Zde jsou všechny vaše kategorie.
						</p>
					</div>
					<AddFilter />
				</div>

				<div className="flex flex-col gap-7 mt-8">
					{filters.map((filter) => (
						<Category
							key={filter._id}
							name={filter.name}
							color={filter.color}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
