<template>
	<div class="flex items-center justify-center h-full">
		<div class="flex flex-col mx-32 px-[30px] min-h-screen max-h-full">
			<div class="flex flex-row items-end my-[40px] space-x-6">
				<AniInput label="Search" search clearable v-model.lazy="filters.search" />
				<AniSelect label="Genres" multiple :options="genres" v-model.lazy="filters.genres" />
				<AniSelect label="Year" :options="years" v-model.lazy="filters.year" />
				<AniSelect label="Season" :options="seasons" v-model.lazy="filters.season" />
				<AniSelect label="Format" multiple :options="formats" v-model.lazy="filters.formats" />
				<div class="relative grow">
					<el-button class="float-right aspect-1 w-[40px] hover:text-aniPrimary focus:bg-aniWhite" size="large" color="#fafafa" @click="isOpen = !isOpen">
						<font-awesome-icon icon="fas fa-sliders-h" :class="[isOpen ? 'text-aniPrimary' : 'text-[#afbfd1]']" class="stroke-2 focus:text-aniPrimary hover:text-aniPrimary" />
					</el-button>
					<div v-show="isOpen" class="fixed inset-0 z-0" @click="isOpen = !isOpen" />
					<div v-show="isOpen" class="flex flex-col absolute right-0 top-10 z-10 p-[40px] bg-aniWhite mt-[10px] rounded-[10px] shadow-aniShadow w-[800px]">
						<div class="flex flex-row mb-[30px] items-end space-x-6">
							<el-select class="ani-select-template" v-model="currentTemplate" @change="changeTiersTemplate(templates[currentTemplate])" placeholder="Template">
								<el-option label="Logarithmic" :value="0" />
								<el-option label="Linear" :value="1" />
							</el-select>
							<div class="flex flex-row items-end grow">
								<el-button type="primary" class="grow" size="large" @click="[removeAllTiersEntries(), autoRank = true, setEntries(entries)]">Auto rank anime</el-button>
								<el-button type="danger" class="grow" size="large" @click="[autoRank = false, removeTiersEntries()]">Unrank all anime</el-button>
							</div>
						</div>
						<template v-for="(tier, index) in tiers" :key="tier.name">
							<div class="flex flex-row items-center space-x-6 mb-[10px]">
								<el-button type="danger" class="aspect-1" size="large" @click="removeTier(index)">
									<font-awesome-icon icon="fas fa-trash-alt" />
								</el-button>
								<AniInput class="shrink ani-input-tier" background="body" v-model="tier.name" />
								<AniColorPicker v-model="tier.color" />
								<AniMultiRangeSlider class="grow" v-model="tier.range" />
							</div>
						</template>
						<el-button type="primary" class="w-full mt-[15px]" size="large" text bg @click="addTier">
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
			<div class="flex justify-center" id="downloadDialog"></div>
		</el-dialog>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { ElButton, ElSelect, ElOption, ElDialog, ElEmpty } from "element-plus";
import data from '../content/data.json'
import templatesJSON from '../content/templates.json'

export default {
	name: "tierList",
	components: {
		draggable,
		ElSelect,
		ElOption,
		ElButton,
		ElDialog,
		ElEmpty
	},
	data() {
		return {
			downloadDialogVisible: ref(false),
			tiers: [],
			unRankedTier: [],
			filters: {
				search: '',
				genres: [],
				year: '',
				season: '',
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
			isOpen: false
		}
	},
	created() {
		this.changeTiersTemplate(this.templates[this.currentTemplate]);
		this.getAllEntries;
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}
		data.genres.forEach(element => {
			this.genres.push({ label: element, value: element })
		})
	},
	methods: {
		removeTier(index) {
			this.unRankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
				let newTier = {
					name: 'New tier',
					color: '#2B2D42',
					range: [0, 0],
					entries: []
				}
				this.tiers.push(newTier);
			} else {
				this.tiers.push(this.templates[this.currentTemplate].value[this.tiers.length]);
			}
		},
		removeTiersEntries() {
			this.tiers.forEach(tier => {
				this.unRankedTier.push(...tier.entries);
				tier.entries = [];
			})
		},
		removeUnrankedTierEntries() {
			this.unRankedTier = [];
		},
		removeAllTiersEntries() {
			this.removeTiersEntries();
			this.removeUnrankedTierEntries();
		},
		setEntries(list) {
			list.forEach(entry => {
				if (entry.score != 0 && this.autoRank) {
					this.tiers.forEach(tier => {
						if ((entry.score >= tier.range[0] && entry.score <= tier.range[1])) {
							tier.entries.push(entry);
						}
					})
				} else {
					this.unRankedTier.push(entry);
				}
			});
		},
		changeTiersTemplate(template) {
			if (this.tiers.length > 0) {
				this.removeTiersEntries();
				this.tiers = [];
			}
			this.tiers = Array.from(template.value);
			if (this.autoRank) {
				this.setEntries(this.entries)
			}
		}
	},
	computed: {
		async getAllEntries() {
			const route = useRoute()
			const { data } = await useAsyncGql({
				operation: 'entries',
				variables: { username: route.params.username }
			})
			this.isLoaded = true;
			let result = data.value.MediaListCollection.lists[0].entries;
			this.entries = result.sort((a, b) => b.score - a.score);
			if (route.query.seasons != null) this.filters.seasons = true;
			if (route.query.min != null && route.query.min != 0 && route.query.min <= 10) this.filters.range[0] = route.query.min;
			if (route.query.max != null && route.query.max != 10 && route.query.max >= this.filters.range[0]) this.filters.range[1] = route.query.max;
			this.autoRank = route.query.auto != null ? true : false;
			this.setEntries(this.entries);
		},
	},
};
</script>