<!-- eslint-disable vue/return-in-computed-property -->
<!-- eslint-disable vue/no-async-in-computed-properties -->
<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
	<div class="flex h-full items-center justify-center">
		<div class="mx-32 flex max-h-full min-h-screen flex-col px-[30px]">
			<div class="my-[40px] flex flex-row items-end space-x-6">
				<AniInput v-model.lazy="filters.search" label="Search" search clearable />
				<AniSelect v-model.lazy="filters.genres" label="Genres" multiple :options="genres" />
				<AniSelect v-model.lazy="filters.year" label="Year" :options="years" />
				<AniSelect v-model.lazy="filters.season" label="Season" :options="seasons" />
				<AniSelect v-model.lazy="filters.formats" label="Format" multiple :options="formats" />
				<div class="relative grow">
					<el-button class="aspect-square float-right w-[40px] hover:text-aniPrimary focus:bg-aniWhite" size="large" color="#fafafa" @click="isOpen = !isOpen">
						<font-awesome-icon icon="fas fa-sliders-h" :class="[isOpen ? 'text-aniPrimary' : 'text-[#afbfd1]']" class="stroke-2 hover:text-aniPrimary focus:text-aniPrimary" />
					</el-button>
					<div v-show="isOpen" class="fixed inset-0 z-0" @click="isOpen = !isOpen" />
					<div v-show="isOpen" class="absolute right-0 top-10 z-10 mt-[10px] flex w-[800px] flex-col rounded-[10px] bg-aniWhite p-[40px] shadow-aniShadow">
						<div class="mb-[30px] flex flex-row items-end space-x-6">
							<el-select v-model="currentTemplate" class="ani-select-template" placeholder="Template" @change="changeTiersTemplate(templates[currentTemplate])">
								<el-option label="Logarithmic" :value="0" />
								<el-option label="Linear" :value="1" />
							</el-select>
							<div class="flex grow flex-row items-end">
								<el-button type="primary" class="grow" size="large" @click="[removeAllTiersEntries(), (autoRank = true), setEntries(entries)]">Auto rank anime</el-button>
								<el-button type="danger" class="grow" size="large" @click="[(autoRank = false), removeTiersEntries()]">Unrank all anime</el-button>
							</div>
						</div>
						<template v-for="(tier, index) in tiers" :key="tier.name">
							<div class="mb-[10px] flex flex-row items-center space-x-6">
								<el-button type="danger" class="aspect-square" size="large" @click="removeTier(index)">
									<font-awesome-icon icon="fas fa-trash-alt" />
								</el-button>
								<AniInput v-model="tier.name" class="ani-input-tier shrink" background="body" />
								<AniColorPicker v-model="tier.color" />
								<AniMultiRangeSlider v-model="tier.range" class="grow" />
							</div>
						</template>
						<el-button type="primary" class="mt-[15px] w-full" size="large" text bg @click="addTier">
							<font-awesome-icon icon="fas fa-plus" />
						</el-button>
					</div>
				</div>
			</div>
			<AniTags v-model="filters" />
			<div v-if="isLoaded && entries.length > 0" id="tierList">
				<div class="overflow-hidden rounded-[6px]">
					<Tier v-for="tier in tiers" :key="tier.name" v-model="tier.name" :name="tier.name" :color="tier.color" :entries="tier.entries" group="tier" transition :filters="filters" />
				</div>
				<Tier class="mt-8" :entries="unRankedTier" group="tier" transition :filters="filters" />
			</div>
			<AniLoader v-else-if="!isLoaded" />
			<el-empty v-else description="No anime found, please check the username" />
		</div>
		<SaveAsImage v-if="true" @click="downloadDialogVisible = true" />
		<el-dialog v-model="downloadDialogVisible" destroy-on-close title="Right click > Save image as" fullscreen>
			<div id="downloadDialog" class="flex justify-center"></div>
		</el-dialog>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { ElButton, ElSelect, ElOption, ElDialog, ElEmpty } from "element-plus";
import data from "../content/data.json";
import templatesJSON from "../content/templates.json";

export default {
	name: "TierList",
	components: {
		draggable,
		ElSelect,
		ElOption,
		ElButton,
		ElDialog,
		ElEmpty,
	},
	setup () {
		const store = useEntriesStore();
	},
	data() {
		return {
			downloadDialogVisible: ref(false),
			tiers: [],
			unRankedTier: [],
			filters: {
				search: "",
				genres: [],
				year: "",
				season: "",
				formats: [],
				seasons: false,
				range: [0, 10],
			},
			years: [],
			seasons: data.seasons,
			genres: [],
			formats: data.formats,
			templates: templatesJSON,
			currentTemplate: 0,
			entries: [],
			drag: false,
			isLoaded: false,
			autoRank: false,
			isOpen: false,
		};
	},
	computed: {
		async getAllEntries() {
			const route = useRoute()
			const store = useEntriesStore();
			this.isLoaded = await store.fetchAllData(route.params.username);
			if (route.query.seasons != null && route.query.seasons == "false") {
				store.setEntriesByFranchise()
			} else {
				store.setEntriesBySeasons()
			}
			store.sortEntriesByScore();
			if (route.query.min != null && route.query.min != 0 && route.query.min <= 10) store.setFilterMinimumRange(route.query.min);
			if (route.query.max != null && route.query.max != 10 && route.query.max >= 0) store.setFilterMinimumRange(route.query.max);
			this.filters.range = store.getAllFilters.range;
			this.autoRank = route.query.auto != null ? true : false;
			this.entries = store.getAllEntries
			this.setEntries(this.entries);
		},
	},
	created() {
		this.changeTiersTemplate(this.templates[this.currentTemplate]);
		this.getAllEntries;
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}
		data.genres.forEach((element) => {
			this.genres.push({ label: element, value: element });
		});
	},
	methods: {
		removeSeason(entryId) {
			const entry = this.entries.find((entry) => entry.media.id === entryId);
			const values = {
				episodes: [].push(entry.media.episodes || 1),
				averageScore: [].push(entry.media.averageScore),
				score: [].push(entry.score),
				format: [].push(entry.media.format),
				season: [].push(entry.media.season),
				seasonYear: [].push(entry.media.seasonYear),
			};
			let res = {};
			if (entry.media.relations) {
				entry.media.relations.edges.forEach((edge) => {
					if (edge.node.format != "MANGA" || edge.node.format != "NOVEL" || edge.node.format != "ONE_SHOT" || edge.node.format != "MUSIC") {
						if (edge.relationType === "SEQUEL" && Date(edge.node.startDate.year, edge.node.startDate.month, edge.node.startDate.day) > Date(entry.media.startDate.year, entry.media.startDate.month, entry.media.startDate.day)) {
							this.entries.splice(
								this.entries.findIndex((entry) => entry.media.id === edge.node.id),
								1,
							);
							res = this.removeSeason(edge.node.id);
						} else if (edge.relationType === "PREQUEL" && Date(edge.node.startDate.year, edge.node.startDate.month, edge.node.startDate.day) > Date(entry.media.startDate.year, entry.media.startDate.month, entry.media.startDate.day)) {
							this.entries.splice(
								this.entries.findIndex((entry) => entry.media.id === edge.node.id),
								1,
							);
							res = this.removeSeason(edge.node.id);
						} else {
							console.log(values);
							return values;
						}
					}
					return {
						episodes: values.episodes.concat(res.media.episodes || 1),
						averageScore: values.averageScore.concat(res.media.averageScore),
						score: values.score.concat(res.score),
						format: values.format.concat(res.media.format),
						season: values.season.concat(res.media.season),
						seasonYear: values.seasonYear.concat(res.media.seasonYear),
					};
				});
			}
		},
		removeTier(index) {
			this.unRankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
				const newTier = {
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
		removeTiersEntries() {
			this.tiers.forEach((tier) => {
				this.unRankedTier.push(...tier.entries);
				tier.entries = [];
			});
		},
		removeUnrankedTierEntries() {
			this.unRankedTier = [];
		},
		removeAllTiersEntries() {
			this.removeTiersEntries();
			this.removeUnrankedTierEntries();
		},
		setEntries(list) {
			list.forEach((entry) => {
				if (entry.score != 0 && this.autoRank) {
					this.tiers.forEach((tier) => {
						if (entry.score >= tier.range[0] && entry.score <= tier.range[1]) {
							tier.entries.push(entry);
						}
					});
				} else {
					this.unRankedTier.push(entry);
				}
			});
			this.isLoaded = true;
		},
		changeTiersTemplate(template) {
			if (this.tiers.length > 0) {
				this.removeTiersEntries();
				this.tiers = [];
			}
			this.tiers = Array.from(template.value);
			if (this.autoRank) {
				this.setEntries(this.entries);
			}
		},
	},
};
</script>
