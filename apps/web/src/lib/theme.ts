import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";
import type { Theme } from "../data/providers/theme-provider.tsx";

const storageKey = "ui-theme";

const ThemeSchema = z.object({
	theme: z.string(),
});

export const getThemeServerFn = createServerFn().handler(async () => (getCookie(storageKey) || "dark") as Theme);

export const setThemeServerFn = createServerFn({ method: "POST" })
	.inputValidator(ThemeSchema)
	.handler(async ({ data }) => {
		setCookie(storageKey, data.theme);
	});
