/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./app.vue", "./error.vue"],
	theme: {
		fontFamily: {
			sans: ["overpass"],
		},
		extend: {
			colors: {
				aniPrimary: "#3db4f2",
				aniBody: "#edf1f5",
				aniWhite: "#fafafa",
				aniGray: "#5c728a",
				aniRed: "var(--color-red)",
				aniPeach: "var(--color-peach)",
				aniOrange: "var(--color-orange)",
				aniYellow: "var(--color-yellow)",
				aniGreen: "var(--color-green)",
				aniPurple: "var(--color-purple)",
			},
			borderRadius: {
				aniRounded: "4px",
			},
			lineHeight: {
				aniLeading: "40px",
			},
			boxShadow: {
				aniShadowButton: "0 1px 10px 0 rgba(49,54,68,0.15)",
				aniShadow: "0px 14px 30px rgba(103, 132, 187, 0.1), 0px 4px 4px rgba(103, 132, 187, 0.04)",
			},
		},
	},
	safelist: [
		{
			pattern: /bg-(gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fucshia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
		},
	],
	corePlugins: {
		aspectRatio: false,
	},
};
