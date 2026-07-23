import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import Header from "@/components/Header.tsx";
import TrainingsList from "@/components/treninky/TrainingsList";
import { authClient } from "@/lib/auth-client.ts";

export const Route = createFileRoute("/_auth/treninky/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Tréninky | GYM APPLICATION" },
			{ name: "description", content: "Seznam všech tréninků uživatele" },
		],
	}),
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	if (!session) {
		return null;
	}

	return (
		<div className="pb-8">
			<Header page="TRÉNINKY" />
			<Suspense
				fallback={
					<div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
						<LoaderCircle className="h-5 w-5 animate-spin" />
						<span>Načítám tréninky…</span>
					</div>
				}
			>
				<TrainingsList />
			</Suspense>
		</div>
	);
}
