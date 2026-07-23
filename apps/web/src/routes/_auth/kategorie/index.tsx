import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, TableProperties } from "lucide-react";
import { Suspense, useState } from "react";
import { AddFilter } from "@/components/categories/AddFilter";
import Category, { type FilterSummary } from "@/components/categories/category";
import { EditFilter } from "@/components/categories/EditFilter";
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
	return (
		<div className="pb-8">
			<Header page="KATEGORIE" />
			<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">
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

				<Suspense fallback={<CategoriesLoading />}>
					<CategoryList />
				</Suspense>
			</div>
		</div>
	);
}

function CategoryList() {
	const { data: filters } = useSuspenseQuery(convexQuery(api.filters.getFilterSummaries, {}));
	const [selectedFilter, setSelectedFilter] = useState<FilterSummary | null>(null);

	if (filters.length === 0) {
		return <p className="mt-8">Žádné kategorie k zobrazení.</p>;
	}

	return (
		<>
			<div className="mt-8 flex flex-col gap-4">
				{filters.map((filter) => (
					<Category filter={filter} key={filter._id} onEdit={setSelectedFilter} />
				))}
			</div>

			{selectedFilter && <EditFilter filter={selectedFilter} onClose={() => setSelectedFilter(null)} />}
		</>
	);
}

function CategoriesLoading() {
	return (
		<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
			<LoaderCircle className="animate-spin" />
			<span>Načítám kategorie…</span>
		</div>
	);
}
