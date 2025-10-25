import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { Theme } from "../data/providers/theme-provider.tsx";
import z from "zod";

const storageKey = "ui-theme";

const ThemeSchema = z.object({
	theme: z.string(),
});

export const getThemeServerFn = createServerFn().handler(async () => {
	return (getCookie(storageKey) || "dark") as Theme;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
	.inputValidator(ThemeSchema)
	.handler(async ({ data }) => {
		setCookie(storageKey, data.theme);
	});
