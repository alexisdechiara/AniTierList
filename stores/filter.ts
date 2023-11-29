import { defineStore } from "pinia";

export const useFilterStore = defineStore({
	id: "Filters",
	state: () => ({
		search: "" as string,
		genres: [] as string[],
		years: [] as number[],
		seasons: [] as string[],
		formats: [] as string[],
		range: [0, 100] as number[],
		franchise: false as boolean,
	}),
	actions: {
		setMinimumRange(value: number) {
			this.range[0] = Number(value);
		},
		setMaximumRange(value: number) {
			this.range[1] = Number(value);
		},
		setRange(value: number[]) {
			this.range = value;
		},
		setFranchise(value: boolean) {
			this.franchise = value;
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
		getRange(): Array<number> {
			return this.range;
		},
		getFranchise(): boolean {
			return this.franchise;
		},
	},
	persist: {
		storage: persistedState.localStorage,
	},
});
