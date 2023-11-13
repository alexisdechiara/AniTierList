// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
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

	modules: [
						"@element-plus/nuxt", 
						"@nuxtjs/tailwindcss", 
						"@nuxtjs/eslint-module", 
						"@pinia/nuxt",
						"@pinia-plugin-persistedstate/nuxt",
						"nuxt-graphql-client", 
						"@nuxt/image", 
						"@vueuse/nuxt", 
						"nuxt-icon"
					],

	css: ["@fortawesome/fontawesome-svg-core/styles.css"],

	typescript: {
		shim: false,
	},

	build: {
		transpile: ["@fortawesome/vue-fontawesome"],
	},

	devtools: {
		enabled: false,
	},
});
