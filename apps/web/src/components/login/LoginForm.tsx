import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { cn } from "@/lib/utils.ts";

const loginSchema = z.object({
	email: z.string().min(1, "Zadejte email").email("Zadejte platný email"),
	password: z.string().min(1, "Zadejte heslo"),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const [error, setError] = useState<string>("");

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
					callbackURL: "/menu",
					rememberMe: true,
				},
				{
					onError: (ctx) => {
						setError(ctx.error.message);
					},
				}
			);
		},
	});

	return (
		<div className={cn("flex w-[min(480px,90%)] flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-xl md:text-2xl">Přihlásit se</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<div className="flex flex-col gap-6">
							<form.Field name="email">
								{(field) => (
									<div className="grid gap-2">
										<Label className="text-base" htmlFor={field.name}>
											Email
										</Label>
										<Input
											id={field.name}
											name={field.name}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="m@example.com"
											required
											type="email"
											value={field.state.value}
										/>
										{field.state.meta.isTouched && !field.state.meta.isValid ? (
											<p className="text-destructive-foreground text-sm">
												{field.state.meta.errors[0]?.message}
											</p>
										) : null}
									</div>
								)}
							</form.Field>
							<form.Field name="password">
								{(field) => (
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label className="text-base" htmlFor={field.name}>
												Heslo
											</Label>
											<a
												className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
												href="/login"
											>
												Obnovit heslo
											</a>
										</div>
										<Input
											id={field.name}
											name={field.name}
											onChange={(e) => field.handleChange(e.target.value)}
											required
											type="password"
											value={field.state.value}
										/>
										{field.state.meta.isTouched && !field.state.meta.isValid ? (
											<p className="text-destructive-foreground text-sm">
												{field.state.meta.errors[0]?.message}
											</p>
										) : null}
									</div>
								)}
							</form.Field>

							<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
								{([canSubmit, isSubmitting]) => (
									<div className="flex flex-col gap-3">
										<Button
											className="w-full cursor-pointer text-base"
											disabled={!canSubmit}
											type="submit"
										>
											{isSubmitting ? "Přihlašování..." : "Přihlásit se"}
										</Button>
									</div>
								)}
							</form.Subscribe>
						</div>
						<div className="mt-4 text-center text-sm">
							Nemáte účet?{" "}
							<a className="underline underline-offset-4" href="/register">
								Vytvořte si účet
							</a>
						</div>
					</form>
					{error !== "" && <p className="mt-5 text-center text-destructive-foreground">{error}</p>}
				</CardContent>
			</Card>
		</div>
	);
}
