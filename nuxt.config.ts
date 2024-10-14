import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
	modules: [
		"nuxt-icon",
		"@nuxt/image",
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt",
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
		"@element-plus/nuxt",
		"nuxt-graphql-client",
	],

	devtools: {
		enabled: true,
	},

	app: {
		head: {
			charset: "utf-8",
			title: "AniTierList",
			viewport: "width=device-width, initial-scale=1",
			meta: [
				{
					name: "description",
					content: "Unofficial Anilist tierlist maker",
				},
			],
			link: [
				{
					rel: "icon",
					type: "image/x-icon",
					href: "/favicon.ico",
				},
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon.png",
				},
			],
		},
	},

	css: ["@fortawesome/fontawesome-svg-core/styles.css"],

	runtimeConfig: {
		public: {
			GQL_HOST: "https://graphql.anilist.co",
		},
	},

	build: {
		transpile: ["@fortawesome/vue-fontawesome"],
	},

	compatibilityDate: "2024-10-14",

	typescript: {
		typeCheck: true,
		shim: false,
	},

	eslint: {
		config: {
			stylistic: {
				semi: false,
				indent: "tab",
				quotes: "double",
			},
		},
	},
})
