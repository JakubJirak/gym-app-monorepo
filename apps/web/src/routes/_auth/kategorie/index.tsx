import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { TableProperties } from "lucide-react";
import { AddFilter } from "@/components/categories/AddFilter";
import Category from "@/components/categories/category";
import Header from "@/components/Header";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

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

	if (!filters) {
		return null;
	}

	return (
		<div className="pb-8">
			<Header page="KATEGORIE" />
			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<div className="mb-4 flex items-center justify-between pl-1">
					<div className="">
						<h2 className="mb-1 flex items-center gap-2 font-semibold text-lg">
							<TableProperties size={20} />
							Vaše kategorie
						</h2>
						<p className="text-muted-foreground text-sm">Zde jsou všechny vaše kategorie.</p>
					</div>
					<AddFilter />
				</div>

				<div className="mt-8 flex flex-col gap-4">
					{filters.map((filter) => (
						<Category
							color={filter.color}
							id={filter._id}
							key={filter._id}
							name={filter.name}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
