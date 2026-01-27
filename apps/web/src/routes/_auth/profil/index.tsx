import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header.tsx";
import UserAccInfo from "@/components/profil/UserAccInfo";
import UserSetGoals from "@/components/profil/UserSetGoals";
import UserWeightInput from "@/components/profil/UserWeightInput";
import UserDescription from "@/components/profil/userDescription";
import { Separator } from "@/components/ui/separator";

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
			<div className="mx-auto w-[90%] max-w-[500px] space-y-4 pb-8">
				<Separator />
				<UserAccInfo />
				<Separator />
				<UserDescription />
				<Separator />
				<UserWeightInput />
				<Separator />
				<UserSetGoals />
			</div>
		</>
	);
}
