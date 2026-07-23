import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import Header from "@/components/Header.tsx";
import UserAccInfo from "@/components/profil/UserAccInfo";
import UserDescription from "@/components/profil/UserDescription";
import UserSetGoals from "@/components/profil/UserSetGoals";
import UserWeightInput from "@/components/profil/UserWeightInput";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export const Route = createFileRoute("/_auth/profil/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Profil | GYM APPLICATION" },
			{ name: "description", content: "Informace o profilu uživatele" },
		],
	}),
});

function RouteComponent() {
	return (
		<>
			<Header page="PROFIL" />
			<Suspense fallback={<ProfileLoading />}>
				<ProfileContent />
			</Suspense>
		</>
	);
}

function ProfileContent() {
	const { data: profile } = useSuspenseQuery(convexQuery(api.profile.getProfileOverview, {}));

	if (!profile) {
		return <p className="py-8 text-center text-muted-foreground">Profil se nepodařilo načíst.</p>;
	}

	return (
		<div className="mx-auto w-[90%] max-w-125 space-y-4 pb-8">
			<Separator />
			<UserAccInfo account={profile.account} />
			<Separator />
			<UserDescription description={profile.description} />
			<Separator />
			<UserWeightInput weightData={profile.weight} />
			<Separator />
			<UserSetGoals goals={profile.goals} />
		</div>
	);
}

function ProfileLoading() {
	return (
		<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
			<LoaderCircle className="animate-spin" />
			<span>Načítám profil…</span>
		</div>
	);
}
