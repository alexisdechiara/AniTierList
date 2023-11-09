import { defineStore } from "pinia";

export const useEntriesStore = defineStore("entries",{
	state: () => {
		return {
			data: {} as any,
			entries: [] as any,
			isLoaded: false as Boolean,
			filters: {
				search: "" as String,
				genres: [] as Array<String>,
				year: "" as String | Number,
				season: "" as String,
				formats: [] as Array<String>,
				range: [0, 10],
			},
		};
	},
	actions: {
		async fetchAllData(username: String) {
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username },
			});
			this.data = data;
		},
		setEntries(type: String) {
			if (type !== "franchise") {
				this.entries = this.data.MediaListCollection.lists[0].entries;
			} else {
				this.data.MediaListCollection.lists[0].entries.forEach((entry: any) => {
					const filteredEntry = entry;
					filteredEntry.media.relations.edges = entry.media.relations.edges.filter((edge: any) => edge.relationType === "SEQUEL" || edge.relationType === "PREQUEL" || edge.relationType === "SIDE_STORY" || edge.relationType === "SPIN_OFF");
					if (!filteredEntry.media.relations.edges.some((edge: any) => new Date(edge.node.startDate.year, edge.node.startDate.month, edge.node.startDate.day).getTime() < new Date(entry.media.startDate.year, entry.media.startDate.month, entry.media.startDate.day).getTime())) {
						console.log(entry.media.title.english + " - accepté");
						entry.isFranchise = filteredEntry.media.relations.edges.length > 0;
						if (!this.entries.includes(entry)) {
							this.entries.push(entry);
							console.log(entry);
						} else {
							console.warn(entry.media.title.english + " - doublon : ");
						}
					} else {
						console.error(entry.media.title.english + " - refusé : " + filteredEntry.media.relations.edges.length);
					}
				});
			}
		},
		setEntriesBySeasons() {
			this.setEntries("seasons");
		},
		setEntriesByFranchise() {
			this.setEntries("franchise");
		},
		sortEntriesByScore() {
			this.entries = this.entries.sort((a, b) => b.score - a.score);
		},
		setFilterMinimumRange(value: number) {
			if (this.filters.range[1] > value) {
				this.filters.range[0] = value;
			} else throw new Error("Minimum range cannot be greater than maximum range");
		},
		setFilterMaximumRange(value: number) {
			if (this.filters.range[0] < value) {
				this.filters.range[1] = value;
			} else throw new Error("Maximum range cannot be less than minimum range");
		},
	},
	getters: {
		getAllEntries: (state) => state.entries,
		getEntryById: (state) => {
			return (entryId: number) => {
				const entry = state.data.MediaListCollection.lists[0].entries.find((entry: any) => entry.media.id === entryId);
				if (entry == null) {
					throw new Error("Entry not found");
				} else return entry;
			};
		},
		getAllFilters: (state) => state.filters,
	},
});
