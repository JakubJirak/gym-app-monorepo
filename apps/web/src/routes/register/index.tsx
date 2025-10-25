import { RegisterForm } from "@/components/register/RegisterForm";
import { createFileRoute, redirect } from "@tanstack/react-router";

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
		<div className="flex mt-10 items-center justify-center">
			<RegisterForm />
		</div>
	);
}
