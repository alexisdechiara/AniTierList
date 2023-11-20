import { defineStore } from "pinia";
import templatesJSON from "../content/templates.json";

export const useTierStore = defineStore({
	id: "Tiers",
	state: () => ({
		tiers: [] as Array<Tier>,
		unrankedTier: [] as Array<any>,
		autoRank: false as Boolean,
		templates: templatesJSON as Array<Template>,
		currentTemplate: 0 as number,
	}),
	getters: {
		isAutoRank(): Boolean {
			return this.autoRank;
		},
		getAllEntries(): Array<any> {
			return [...this.unrankedTier, ...this.tiers.flatMap((tier: Tier) => tier.entries)];
		},
	},
	actions: {
		setAutoRank(value: boolean) {
			this.autoRank = value;
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
		async fetchAllEntries(username: string, onlyFranchise: boolean = false) {
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username },
			});
			const filterStore = useFilterStore();
			if (onlyFranchise == false) {
				if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
					this.unrankedTier = data.value.MediaListCollection.lists[0].entries.filter((entry: any) => entry.score >= filterStore.getMinimumRange && entry.score <= filterStore.getMaximumRange);
				}
			} else {
				if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
					data.value.MediaListCollection.lists[0].entries
						.filter((entry: any) => entry.score >= filterStore.getMinimumRange && entry.score <= filterStore.getMaximumRange)
						.forEach((entry: any) => {
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

			const userStore = useUserStore();
			if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) userStore.setLastCompletedAt(this.findLatestCompletedEntry(data.value.MediaListCollection.lists[0].entries));
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
