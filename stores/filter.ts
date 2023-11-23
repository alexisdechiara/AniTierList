import { defineStore } from "pinia";

export const useFilterStore = defineStore({
	id: "Filters",
	state: () => ({
		search: "" as string,
		genres: [] as Array<string>,
		years: [] as Array<number>,
		seasons: [] as Array<string>,
		formats: [] as Array<string>,
		range: [0, 10] as Array<number>,
	}),
	actions: {
		setMinimumRange(value: number) {
			// if (this.range[1] >= value) {
			this.range[0] = Number(value);
			// } else throw new Error("Minimum range cannot be greater than maximum range");
		},
		setMaximumRange(value: number) {
			// if (this.range[0] <= value) {
			this.range[1] = Number(value);
			// } else throw new Error("Maximum range cannot be less than minimum range");
		},
		removeGenreByIndex(index: number) {
			this.genres.splice(index, 1);
		},
		removeFormatByIndex(index: number) {
			this.formats.splice(index, 1);
		},
		removeSeasonByIndex(index: number) {
			this.seasons.splice(index, 1);
		},
		removeYearByIndex(index: number) {
			this.years.splice(index, 1);
		},
	},
	getters: {
		getMinimumRange(): number {
			return this.range[0];
		},
		getMaximumRange(): number {
			return this.range[1];
		},
		getSearch(): string {
			return this.search;
		},
		getGenres(): Array<string> {
			return this.genres;
		},
		getYears(): Array<number> {
			return this.years;
		},
		getSeasons(): Array<string> {
			return this.seasons;
		},
		getFormats(): Array<string> {
			return this.formats;
		},
	},
	persist: {
		storage: persistedState.localStorage,
	},
});
