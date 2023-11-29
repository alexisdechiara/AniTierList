import { useUserStore } from "./user";
import { defineStore } from "pinia";
import templatesJSON from "../content/templates.json";
import { ScoreFormat } from "#gql/default";

export const useTierStore = defineStore({
	id: "Tiers",
	state: () => ({
		tiers: [] as Array<Tier>,
		unrankedTier: [] as Array<any>,
		autoRank: false as boolean,
		templates: templatesJSON as Array<Template>,
		currentTemplate: 0 as number,
		skipFetch: false as boolean,
	}),
	getters: {
		isAutoRank(): boolean {
			return this.autoRank;
		},
		getAllEntries(): any[] {
			return [...this.unrankedTier, ...this.tiers.flatMap((tier: Tier) => tier.entries)];
		},
		getSkipFetch(): boolean {
			return this.skipFetch;
		},
	},
	actions: {
		setAutoRank(value: boolean) {
			this.autoRank = value;
		},
		setSkipFetch(value: boolean) {
			this.skipFetch = value;
		},
		sortUnrankedTierEntries() {
			const userStore = useUserStore();
			switch (userStore.rowOrder) {
				case "Score":
					this.sortUnrankedTierEntriesByScore();
					break;
				case "Title":
					this.sortUnrankedTierEntriesByTitle();
					break;
				case "Last Updated":
					this.sortUnrakedTierEntriesByUpdatedDate();
					break;
				case "Last Added":
					this.sortUnrakedTierEntriesByCompletedDate();
					break;
			}
		},
		sortUnrankedTierEntriesByScore() {
			this.unrankedTier.sort((a: any, b: any) => b.score - a.score);
		},
		sortUnrankedTierEntriesByTitle() {
			const userStore = useUserStore();
			this.unrankedTier.sort((a: any, b: any) => a.media.title[userStore.getTitleLanguage.toLowerCase()].localeCompare(b.media.title[userStore.getTitleLanguage.toLowerCase()]));
		},
		sortUnrakedTierEntriesByUpdatedDate() {
			//To fix - new Date(b.updatedAt) - new Date(a.updatedAt) doesn't work
			this.unrankedTier.sort((a: any, b: any) => new Date(b.updatedAt) - new Date(a.updatedAt));
		},
		sortUnrakedTierEntriesByCompletedDate() {
			this.unrankedTier.sort((a: any, b: any) => new Date(b.completedAt.year, b.completedAt.month, b.completedAt.day) - new Date(a.completedAt.year, a.completedAt.month, a.completedAt.day));
		},
		findLatestCompletedEntry(entries: Array<any>): any {
			return entries.reduce((latestEntry, currentEntry) => {
				if (currentEntry.completedAt && (!latestEntry.completedAt || new Date(currentEntry.completedAt.year, currentEntry.completedAt.month, currentEntry.completedAt.day) > new Date(latestEntry.completedAt.year, latestEntry.completedAt.month, latestEntry.completedAt.day))) {
					return new Date(currentEntry.completedAt.year, currentEntry.completedAt.month, currentEntry.completedAt.day);
				}
				return new Date(latestEntry.completedAt.year, latestEntry.completedAt.month, latestEntry.completedAt.day);
			}, Date.now());
		},
		async fetchEntriesByCompletedDate(username: string, completedAt: number) {
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username, completedAt: completedAt },
			});
			if (data.value.MediaListCollection.lists.length > 0) {
				return data.value.MediaListCollection.lists[0].entries;
			} else {
				return [];
			}
		},
		async fetchAllEntries(username: string) {
			const userStore = useUserStore();
			const filterStore = useFilterStore();
			console.log("Fetching all entries...", ScoreFormat[userStore.getScoreFormat]);
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username, ScoreFormat: ScoreFormat[userStore.getScoreFormat] },
			});
			if (data.value.MediaListCollection != null) {
				if (filterStore.getFranchise == false) {
					if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
						this.unrankedTier = data.value.MediaListCollection.lists[0].entries.filter((entry: any) => entry.score >= filterStore.getMinimumRange && entry.score <= filterStore.getMaximumRange);
					}
				} else {
					if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
						data.value.MediaListCollection.lists[0].entries.forEach((entry: any) => {
							const filteredEntry = entry;
							filteredEntry.media.relations.edges = entry.media.relations.edges.filter((edge: any) => edge.relationType === "SEQUEL" || edge.relationType === "PREQUEL" || edge.relationType === "SIDE_STORY" || edge.relationType === "SPIN_OFF");
							if (!filteredEntry.media.relations.edges.some((edge: any) => new Date(edge.node.startDate.year, edge.node.startDate.month, edge.node.startDate.day).getTime() < new Date(entry.media.startDate.year, entry.media.startDate.month, entry.media.startDate.day).getTime())) {
								console.log(entry.media.title.english + " - accepté");
								entry.isFranchise = filteredEntry.media.relations.edges.length > 0;
								this.addUnrankedTierEntry(entry);
							} else {
								console.error(entry.media.title.english + " - refusé : " + filteredEntry.media.relations.edges.length);
							}
						});
					}
				}
				if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) userStore.setLastCompletedAt(this.findLatestCompletedEntry(data.value.MediaListCollection.lists[0].entries));
			}
		},
		changeEntriesScoreRange(oldRange: Array<number>, newRange: Array<number>) {
			this.tiers.forEach((tier: Tier) => {
				tier.entries.forEach((entry: any) => {
					entry.score = ((entry.score - oldRange[0]) * (newRange[1] - newRange[0])) / (oldRange[1] - oldRange[0]) + newRange[0];
				});
			});

			this.unrankedTier.forEach((entry: any) => {
				entry.score = ((entry.score - oldRange[0]) * (newRange[1] - newRange[0])) / (oldRange[1] - oldRange[0]) + newRange[0];
			});
		},
		setUnrankedTierEntries(entries: Array<any>) {
			this.unrankedTier = entries;
		},
		addUnrankedTierEntries(entries: Array<any>) {
			this.unrankedTier.push(...entries);
		},
		addUnrankedTierEntry(entry: any) {
			if (!this.unrankedTier.includes(entry)) {
				this.unrankedTier.push(entry);
				console.log(entry + " - ajouté");
			} else {
				console.warn(entry.media.title.english + " - doublon : ");
			}
		},
		autoRankTiers(overwrite: boolean = false) {
			if (overwrite) {
				this.unrankAllTiersEntries();
			}
			this.unrankedTier.forEach((entry: any) => {
				if (entry.score && this.autoRank) {
					this.tiers.forEach((tier: any) => {
						if (entry.score >= tier.range[0] && entry.score <= tier.range[1]) {
							tier.entries.push(entry);
						}
					});
				}
			});
		},
		addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
				const newTier: Tier = {
					name: "New tier",
					color: "#2B2D42",
					range: [0, 0],
					entries: [],
				};
				this.tiers.push(newTier);
			} else {
				this.tiers.push(this.templates[this.currentTemplate].value[this.tiers.length]);
			}
		},
		removeTier(index: number) {
			this.unrankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		changeTiersTemplate(template: Template) {
			if (this.tiers.length > 0) {
				this.unrankAllTiersEntries();
				this.tiers = new Array();
			}
			this.tiers = Array.from(template.value);
			if (this.autoRank) {
				this.autoRankTiers();
			}
		},
		removeUnrankedTierEntries() {
			this.unrankedTier = [];
		},
		unrankAllTiersEntries() {
			this.tiers.forEach((tier: Tier) => {
				this.unrankTierEntries(tier);
			});
		},
		unrankTierEntries(tier: Tier) {
			this.unrankedTier.unshift(...tier.entries);
			tier.entries = new Array();
		},
		removeAllTiersEntries() {
			this.unrankAllTiersEntries();
			this.removeUnrankedTierEntries();
		},
	},
	persist: {
		storage: persistedState.localStorage,
	},
});

// Tier interface
interface Tier {
	name: String;
	color: String;
	range: Array<Number>;
	entries: Array<any>;
}

// Templates interface
interface Template {
	label: String;
	value: Array<Tier>;
}
