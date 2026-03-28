import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/components/register/RegisterForm";

export const Route = createFileRoute("/register/")({
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
			{ title: "Vytvoření účtu | GYM APPLICATION" },
			{ name: "description", content: "Formulář pro vytvoření nového účtu" },
		],
	}),
});

function RouteComponent() {
	return (
		<div className="mt-10 flex items-center justify-center">
			<RegisterForm />
		</div>
	);
}
