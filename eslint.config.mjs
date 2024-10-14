// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
	// Your custom configs here
	{
		files: ["*.vue", "**/*.vue", "*.ts", "**/*.ts", "*.mjs"],
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"vue/multi-word-component-names": "warn",
			"vue/max-attributes-per-line": ["warn", {
				singleline: {
					max: 10,
				},
				multiline: {
					max: 1,
				},
			}],
			"vue/singleline-html-element-content-newline": ["warn", {
				ignores: ["div"],
			}],
		},
	},
	...tailwind.configs["flat/recommended"],
)
