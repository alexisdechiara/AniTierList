import { defineStore } from "pinia"
import templatesJSON from "../content/templates.json"
import { useUserStore } from "./user"
import { ScoreFormat } from "#gql/default"

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
			return this.autoRank
		},
		getAllEntries(): any[] {
			return [...this.unrankedTier, ...this.tiers.flatMap((tier: Tier) => tier.entries)]
		},
		getSkipFetch(): boolean {
			return this.skipFetch
		},
	},
	actions: {
		populateMockData() {
			console.log("Populating with mock data...");
			this.unrankedTier = []; // Clear existing data
			const numItems = 3000; // Target for mock items

			const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
			const formats = ['TV', 'MOVIE', 'OVA', 'SPECIAL', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT'];
			const allGenres = [
				'Action', 'Adventure', 'Comedy', 'Drama', 'Slice of Life', 
				'Sci-Fi', 'Mecha', 'Fantasy', 'Magic', 'Supernatural', 
				'Horror', 'Mystery', 'Psychological', 'Romance', 'Sports',
				'Music', 'Mahou Shoujo', 'Thriller', 'Historical', 'Military', // Added more genres
				'Isekai', 'Cyberpunk', 'Space', 'Vampire', 'Josei', 'Seinen', 'Shoujo', 'Shounen',
				'Ecchi', // Acknowledged as a valid genre on AniList
			];

			for (let i = 0; i < numItems; i++) {
				const year = 2000 + (i % 25); // Years from 2000 to 2024
				const season = seasons[i % seasons.length];
				const format = formats[i % formats.length];
				
				const itemGenres = [];
				const numGenresForThisItem = 1 + (i % 5); // 1 to 5 genres per item
				for (let j = 0; j < numGenresForThisItem; j++) {
					// Cycle through allGenres to give variety
					itemGenres.push(allGenres[(i * numGenresForThisItem + j) % allGenres.length]);
				}

				this.unrankedTier.push({
					media: {
						id: i + 1, // Unique ID, starting from 1
						title: { 
							english: `Mock Anime English Title ${i + 1}`, 
							userPreferred: `Mock Anime Preferred Title ${i + 1}`,
							romaji: `Mock Anime Romaji ${i + 1}`,
							native: `モックアニメタイトル ${i + 1}` // Mock Japanese Title
						},
						seasonYear: year,
						season: season,
						format: format,
						genres: [...new Set(itemGenres)], // Ensure unique genres for this item
						startDate: { year: year, month: (i % 12) + 1, day: (i % 28) + 1 },
						relations: { edges: [] }, // Default to empty relations
						episodes: 1 + (i % 100), // Example: 1-100 episodes
						chapters: null, // For anime, chapters might be null
						volumes: null, // For anime, volumes might be null
						status: ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'][i%5],
						averageScore: (i % 100), // Example average score
						popularity: (i * 10) + 50, // Example popularity
						countryOfOrigin: ['JP', 'CN', 'KR', 'US'][i%4], // Example country codes
					},
					score: (i % 10) * 10, // Score in steps of 10 for POINT_100, or adapt if another ScoreFormat is default
                                                    // If ScoreFormat is POINT_10, then (i % 10) + 1 would be 1-10.
                                                    // Assuming POINT_100 for now: 0, 10, 20, ..., 90. Or (i%101) for 0-100.
                                                    // Let's use 0-100 for wider range: (i % 101)
					// For POINT_100 (0-100), (i % 101) is fine.
					// For POINT_10 (0-10), (i % 11) is fine.
					// For POINT_5 (0-5), (i % 6) is fine.
					// Let's stick to a 0-100 range for the raw score for now, as it's common.
					score: (i % 101), // Score from 0 to 100.
					completedAt: { year: year, month: (i % 12) + 1, day: (i % 28) + 1 },
					updatedAt: Date.now() - (i * 3600000), // Simulating updates over time, i hours ago
					startedAt: { year: year -1, month: (i % 12) + 1, day: (i % 28) + 1}, // Started a year before completed
					isFranchise: (i % 10 === 0), // Example for isFranchise if used by any component logic
					// ensure all fields used by any check function in UnrankedTier.vue are present
					// title, seasonYear, season, format, genres, score are primary for filtering
				});
			}
			console.log(`Populated ${this.unrankedTier.length} mock items into unrankedTier.`);
			// Optional: If the default view should be sorted, call a sort function here.
			// e.g., this.sortUnrankedTierEntriesByTitle(); 
		},
		setAutoRank(value: boolean) {
			this.autoRank = value
		},
		setSkipFetch(value: boolean) {
			this.skipFetch = value
		},
		sortUnrankedTierEntries() {
			const userStore = useUserStore()
			switch (userStore.rowOrder) {
				case "Score":
					this.sortUnrankedTierEntriesByScore()
					break
				case "Title":
					this.sortUnrankedTierEntriesByTitle()
					break
				case "Last Updated":
					this.sortUnrakedTierEntriesByUpdatedDate()
					break
				case "Last Added":
					this.sortUnrakedTierEntriesByCompletedDate()
					break
			}
		},
		sortUnrankedTierEntriesByScore() {
			this.unrankedTier.sort((a: any, b: any) => b.score - a.score)
		},
		sortUnrankedTierEntriesByTitle() {
			const userStore = useUserStore()
			this.unrankedTier.sort((a: any, b: any) => a.media.title[userStore.getTitleLanguage.toLowerCase()].localeCompare(b.media.title[userStore.getTitleLanguage.toLowerCase()]))
		},
		sortUnrakedTierEntriesByUpdatedDate() {
			// To fix - new Date(b.updatedAt) - new Date(a.updatedAt) doesn't work
			this.unrankedTier.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		},
		sortUnrakedTierEntriesByCompletedDate() {
			this.unrankedTier.sort((a: any, b: any) => new Date(b.completedAt.year, b.completedAt.month, b.completedAt.day).getTime() - new Date(a.completedAt.year, a.completedAt.month, a.completedAt.day).getTime())
		},
		findLatestCompletedEntry(entries: Array<any>): any {
			return entries.reduce((latestEntry, currentEntry) => {
				if (currentEntry.completedAt && (!latestEntry.completedAt || new Date(currentEntry.completedAt.year, currentEntry.completedAt.month, currentEntry.completedAt.day) > new Date(latestEntry.completedAt.year, latestEntry.completedAt.month, latestEntry.completedAt.day))) {
					return new Date(currentEntry.completedAt.year, currentEntry.completedAt.month, currentEntry.completedAt.day)
				}
				return new Date(latestEntry.completedAt.year, latestEntry.completedAt.month, latestEntry.completedAt.day)
			}, Date.now())
		},
		async fetchEntriesByCompletedDate(username: string, completedAt: number) {
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username, completedAt: completedAt },
			})
			if (data.value.MediaListCollection?.lists && data.value.MediaListCollection.lists.length > 0) {
				return data.value.MediaListCollection.lists[0]?.entries
			}
			else {
				return []
			}
		},
		async fetchAllEntries(username: string) {
			const userStore = useUserStore()
			const filterStore = useFilterStore()
			console.log("Fetching all entries...", userStore.getScoreFormat)
			const { data } = await useAsyncGql({
				operation: "entries",
				variables: { username: username, ScoreFormat: userStore.getScoreFormat },
			})
			if (data.value.MediaListCollection != null) {
				if (filterStore.getFranchise == false) {
					if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
						this.unrankedTier = data.value.MediaListCollection?.lists[0]?.entries?.filter((entry: any) => entry.score >= filterStore.getMinimumRange && entry.score <= filterStore.getMaximumRange) || []
					}
				}
				else {
					if (data.value.MediaListCollection && data.value.MediaListCollection?.lists) {
						data.value.MediaListCollection?.lists[0]?.entries?.forEach((entry: any) => {
							const filteredEntry = entry
							filteredEntry.media.relations.edges = entry.media.relations.edges.filter((edge: any) => edge.relationType === "SEQUEL" || edge.relationType === "PREQUEL" || edge.relationType === "SIDE_STORY" || edge.relationType === "SPIN_OFF")
							if (!filteredEntry.media.relations.edges.some((edge: any) => new Date(edge.node.startDate.year, edge.node.startDate.month, edge.node.startDate.day).getTime() < new Date(entry.media.startDate.year, entry.media.startDate.month, entry.media.startDate.day).getTime())) {
								console.log(entry.media.title.english + " - accepté")
								entry.isFranchise = filteredEntry.media.relations.edges.length > 0
								this.addUnrankedTierEntry(entry)
							}
							else {
								console.error(entry.media.title.english + " - refusé : " + filteredEntry.media.relations.edges.length)
							}
						})
					}
				}
				if (data.value.MediaListCollection?.lists && data.value.MediaListCollection?.lists[0]?.entries) userStore.setLastCompletedAt(this.findLatestCompletedEntry(data.value.MediaListCollection.lists[0].entries))
			}
		},
		changeEntriesScoreRange(oldRange: Array<number>, newRange: Array<number>) {
			this.tiers.forEach((tier: Tier) => {
				tier.entries.forEach((entry: any) => {
					entry.score = ((entry.score - oldRange[0]) * (newRange[1] - newRange[0])) / (oldRange[1] - oldRange[0]) + newRange[0]
				})
			})

			this.unrankedTier.forEach((entry: any) => {
				entry.score = ((entry.score - oldRange[0]) * (newRange[1] - newRange[0])) / (oldRange[1] - oldRange[0]) + newRange[0]
			})
		},
		setUnrankedTierEntries(entries: Array<any>) {
			this.unrankedTier = entries
		},
		addUnrankedTierEntries(entries: Array<any>) {
			this.unrankedTier.push(...entries)
		},
		addUnrankedTierEntry(entry: any) {
			if (!this.unrankedTier.includes(entry)) {
				this.unrankedTier.push(entry)
				console.log(entry + " - ajouté")
			}
			else {
				console.warn(entry.media.title.english + " - doublon : ")
			}
		},
		autoRankTiers(overwrite: boolean = false) {
			if (overwrite) {
				this.unrankAllTiersEntries()
			}
			this.unrankedTier.forEach((entry: any) => {
				if (entry.score && this.autoRank) {
					this.tiers.forEach((tier: any) => {
						if (entry.score >= tier.range[0] && entry.score <= tier.range[1]) {
							tier.entries.push(entry)
						}
					})
				}
			})
		},
		addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
				const newTier: Tier = {
					name: "New tier",
					color: "#2B2D42",
					range: [0, 0],
					entries: [],
				}
				this.tiers.push(newTier)
			}
			else {
				this.tiers.push(this.templates[this.currentTemplate].value[this.tiers.length])
			}
		},
		removeTier(index: number) {
			this.unrankedTier.push(...this.tiers[index].entries)
			this.tiers.splice(index, 1)
		},
		changeTiersTemplate(template: Template) {
			if (this.tiers.length > 0) {
				this.unrankAllTiersEntries()
				this.tiers = []
			}
			this.tiers = Array.from(template.value)
			if (this.autoRank) {
				this.autoRankTiers()
			}
		},
		removeUnrankedTierEntries() {
			this.unrankedTier = []
		},
		unrankAllTiersEntries() {
			this.tiers.forEach((tier: Tier) => {
				this.unrankTierEntries(tier)
			})
		},
		unrankTierEntries(tier: Tier) {
			this.unrankedTier.unshift(...tier.entries)
			tier.entries = []
		},
		removeAllTiersEntries() {
			this.unrankAllTiersEntries()
			this.removeUnrankedTierEntries()
		},
	},
	persist: {
		storage: persistedState.localStorage,
	},
})

// Tier interface
interface Tier {
	name: string
	color: string
	range: Array<number>
	entries: Array<any>
}

// Templates interface
interface Template {
	label: string
	value: Array<Tier>
}
