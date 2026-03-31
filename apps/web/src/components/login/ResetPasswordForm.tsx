import { useForm } from "@tanstack/react-form";
import { linkOptions, useRouter } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(8, "Heslo musi mit alespon 8 znaku").max(100, "Heslo je prilis dlouhe"),
		confirmPassword: z.string().min(8, "Potvrdte svoje heslo"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Hesla se neshoduji",
		path: ["confirmPassword"],
	});

type ResetPasswordFormProps = {
	token?: string;
};

export function ResetPasswordForm({
	className,
	token,
	...props
}: React.ComponentProps<"div"> & ResetPasswordFormProps) {
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onChange: resetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			if (!token) {
				setError("Odkaz pro obnovu hesla je neplatny nebo chybi token.");
				return;
			}

			setError("");
			setSuccessMessage("");

			await authClient.resetPassword(
				{
					newPassword: value.newPassword,
					token,
				},
				{
					onSuccess: async () => {
						setSuccessMessage("Heslo bylo uspesne zmeneno. Nyni se muzete prihlasit.");
						await router.navigate({ to: linkOptions({ to: "/login" }).to });
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
					<CardTitle className="text-center text-xl md:text-2xl">Nastavit nove heslo</CardTitle>
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
							<form.Field name="newPassword">
								{(field) => (
									<div className="grid gap-2">
										<Label className="text-base" htmlFor={field.name}>
											Nove heslo
										</Label>
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

							<form.Field name="confirmPassword">
								{(field) => (
									<div className="grid gap-2">
										<Label className="text-base" htmlFor={field.name}>
											Potvrdte heslo
										</Label>
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
									<Button
										className="w-full cursor-pointer text-base"
										disabled={!(canSubmit && token)}
										type="submit"
									>
										{isSubmitting ? "Ukladani..." : "Ulozit nove heslo"}
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
					{!token && (
						<p className="mt-5 text-center text-destructive-foreground">
							Odkaz je neplatny. Pozadejte o novy odkaz pro obnovu hesla.
						</p>
					)}
					{error !== "" && <p className="mt-5 text-center text-destructive-foreground">{error}</p>}
					{successMessage !== "" && (
						<p className="mt-5 text-center text-green-600">{successMessage}</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
