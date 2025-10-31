"use strict"
module.exports = {
      root: true,
      extends: ["@repo/eslint-config/base"],
      rules: {
        "indent": ["error", "tab"]
      },
      overrides: [
            {
                  files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
              parser: "@typescript-eslint/parser",
                  parserOptions: {
                        ecmaVersion: 2024,
                        sourceType: "module",
                        // pokud máš monorepo tsconfigy, můžeš sem dát pole projektů
                        // project: ["./tsconfig.json", "apps/*/tsconfig.json"]
                  },
            },
      ],
};
