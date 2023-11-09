<template>
	<div class="flex items-center justify-center h-full">
		<div class="mx-32 flex max-h-full min-h-screen flex-col px-[30px]">
			<div class="my-[40px] flex flex-row items-end space-x-6">
				<AniInput v-model.lazy="store.filters.search" label="Search" search clearable />
				<AniSelect v-model.lazy="store.filters.genres" label="Genres" multiple :options="genres" />
				<AniSelect v-model.lazy="store.filters.year" label="Year" :options="years" />
				<AniSelect v-model.lazy="store.filters.season" label="Season" :options="seasons" />
				<AniSelect v-model.lazy="store.filters.formats" label="Format" multiple :options="formats" />
				<div class="relative grow">
					<el-button class="aspect-square float-right w-[40px] hover:text-aniPrimary focus:bg-aniWhite" size="large" color="#fafafa" @click="isOpen = !isOpen">
						<font-awesome-icon icon="fas fa-sliders-h" :class="[isOpen ? 'text-aniPrimary' : 'text-[#afbfd1]']" class="stroke-2 hover:text-aniPrimary focus:text-aniPrimary" />
					</el-button>
					<div v-show="isOpen" class="fixed inset-0 z-0" @click="isOpen = !isOpen" />
					<div v-show="isOpen" class="absolute right-0 top-10 z-10 mt-[10px] flex w-[800px] flex-col rounded-[10px] bg-aniWhite p-[40px] shadow-aniShadow">
						<div class="mb-[30px] flex flex-row items-end space-x-6">
							<el-select v-model="tierStore.currentTemplate" class="ani-select-template" placeholder="Template" @change="tierStore.changeTiersTemplate(templates[currentTemplate])">
								<el-option label="Logarithmic" :value="0" />
								<el-option label="Linear" :value="1" />
							</el-select>
							<div class="flex flex-row items-end grow">
								<el-button type="primary" class="grow" size="large" @click="tierStore.autoRankEntries()">Auto rank anime</el-button>
								<el-button type="danger" class="grow" size="large" @click="tierStore.unrankAllTiersEntries()">Unrank all anime</el-button>
							</div>
						</div>
						<template v-for="(tier, index) in tierStore.tiers" :key="tier.name">
							<div class="mb-[10px] flex flex-row items-center space-x-6">
								<el-button type="danger" class="aspect-square" size="large" @click="tierStore.removeTier(index)">
									<font-awesome-icon icon="fas fa-trash-alt" />
								</el-button>
								<AniInput v-model="tier.name" class="ani-input-tier shrink" background="body" />
								<AniColorPicker v-model="tier.color" />
								<AniMultiRangeSlider v-model="tier.range" class="grow" />
							</div>
						</template>
						<el-button type="primary" class="mt-[15px] w-full" size="large" text bg @click="tierStore.addTier()">
							<font-awesome-icon icon="fas fa-plus" />
						</el-button>
					</div>
				</div>
			</div>
			<AniTags v-model="store.filters" />
			<div v-if="isLoaded && store.getAllEntries.length > 0" id="tierList">
				<div class="overflow-hidden rounded-[6px]">
					<Tier v-for="tier in tierStore.tiers" :key="tier.name" :name="tier.name" :color="tier.color" :entries="tier.entries"/>
				</div>
				<Tier class="mt-8" :entries="tierStore.unrankedTier"/>
			</div>
			<AniLoader v-else-if="!isLoaded" />
			<el-empty v-else description="No anime found, please check the username" />
		</div>
		<SaveAsImage v-if="true" @click="downloadDialogVisible = true" />
		<el-dialog v-model="downloadDialogVisible" destroy-on-close title="Right click > Save image as" fullscreen>
			<div id="downloadDialog" class="fl e x justify-c enter"></div>
		</el-dialog>
	</div>
</template>

<script setup>
import data from "../content/data.json";
import templatesJSON from "../content/templates.json";

const downloadDialogVisible = ref(false);
const years= ref([])
const seasons= ref(data.seasons)
const genres = ref([])
const formats = ref(data.formats);
const templates = ref(templatesJSON);
const currentTemplate = ref(0);
const isLoaded = ref(false);
const isOpen = ref(false);

const store = useEntriesStore();
const tierStore = useTierStore();
const route = useRoute();

await store.fetchAllData(route.params.username);
if (route.query.seasons != null && route.query.seasons == "false") {
	store.setEntriesByFranchise();
} else {
	store.setEntriesBySeasons();
}
store.sortEntriesByScore();
if (route.query.min != null && route.query.min != 0 && route.query.min <= 10) store.setFilterMinimumRange(route.query.min);
if (route.query.max != null && route.query.max != 10 && route.query.max >= 0) store.setFilterMinimumRange(route.query.max);

// Init datas
onMounted(() => {
	for (let index = new Date().getFullYear(); index >= 1940; index--) {
		years.value.push({ label: index, value: index });
	}
	data.genres.forEach((element) => {
		genres.value.push({ label: element, value: element });
	});

	tierStore.changeTiersTemplate(templates.value[currentTemplate.value])
	tierStore.setAutoRank(route.query.auto != null ? true : false);
	tierStore.setTiers(store.getAllEntries);
	isLoaded.value = true;
});
</script>
