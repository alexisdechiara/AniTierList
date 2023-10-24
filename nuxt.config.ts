// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
    app: {
		head: {
			charset: "utf-8",
      title: "AniTierList",
      viewport: 'width=device-width, initial-scale=1',
			meta: [{ name: "description", content: "Unofficial Anilist tierlist maker" }],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "icon", type: "image/png", href: "/favicon.png" },
			],
		},
	},
  modules: ["@element-plus/nuxt", "@nuxtjs/tailwindcss", "nuxt-graphql-client", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Roboto: true,
      Overpass: true,
    },
    display: 'swap',
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css", "@/assets/scss/main.scss", "@/assets/scss/input.scss", "@/assets/scss/button.scss", "@/assets/scss/dialog.scss"],
  typescript: {
    shim: false
  },
  postcss: {
	  plugins: {
		'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
		},
  },
  build: {
  	transpile: ['@fortawesome/vue-fontawesome']
	},
})
