import tsParser from "@typescript-eslint/parser";
import { config as baseConfig } from "../../packages/eslint-config/base.js";

export default [
	// Nech základní sdílený config
	...baseConfig,

	// Lokální ignorace (např. build artefakty specifické pro tento workspace)
	{
		ignores: ["build/**", "dist/**"],
	},

	// Lokální TS/JS overrides (pokud potřebuješ jiný parserOptions / project)
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2024,
				sourceType: "module",
				// pokud chceš types-aware rules, přidej path(y) k místním tsconfigům:
				// project: ["./tsconfig.json"]
			},
		},
		rules: {
			"indent": ["error", "space"]
		},
	},
];
