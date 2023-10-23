// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
    app: {
		head: {
			charset: "utf-8",
      title: "AniTierList",
      viewport: 'width=device-width, initial-scale=1',
			meta: [{ name: "description", content: "Unofficial Anilist tierlist maker" }],
			link: [
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
				},
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "icon", type: "image/png", href: "/favicon.png" },
			],
		},
	},
  modules: ["@element-plus/nuxt", "@nuxtjs/tailwindcss"],
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
