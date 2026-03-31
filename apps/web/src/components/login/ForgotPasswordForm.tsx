import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Zadejte email").email("Zadejte platny email"),
});

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onChange: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setError("");
			setSuccessMessage("");

			const redirectTo =
				typeof window === "undefined" ? "/reset-password" : `${window.location.origin}/reset-password`;

			await authClient.requestPasswordReset(
				{
					email: value.email,
					redirectTo,
				},
				{
					onSuccess: () => {
						setSuccessMessage(
							"Pokud email existuje, odkaz pro obnovu hesla byl v test modu vypsan v backend logu."
						);
					},
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
					<CardTitle className="text-center text-xl md:text-2xl">Obnova hesla</CardTitle>
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

							<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
								{([canSubmit, isSubmitting]) => (
									<Button
										className="w-full cursor-pointer text-base"
										disabled={!canSubmit}
										type="submit"
									>
										{isSubmitting ? "Odesilani..." : "Poslat odkaz"}
									</Button>
								)}
							</form.Subscribe>
						</div>
						<div className="mt-4 text-center text-sm">
							<a className="underline underline-offset-4" href="/login">
								Zpet na prihlaseni
							</a>
						</div>
					</form>
					{error !== "" && <p className="mt-5 text-center text-destructive-foreground">{error}</p>}
					{successMessage !== "" && (
						<p className="mt-5 text-center text-green-600">{successMessage}</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
