import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/login/LoginForm.tsx";

export const Route = createFileRoute("/login/")({
	beforeLoad: ({ context }) => {
		if (context.userId) {
			throw redirect({
				to: "/menu",
			});
		}
	},
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Přihásit se | GYM APPLICATION" },
			{ name: "description", content: "Formulář pro přihlášení uživatele" },
		],
	}),
});

function RouteComponent() {
	return (
		<div className="mt-10 flex items-center justify-center">
			<LoginForm />
		</div>
	);
}
