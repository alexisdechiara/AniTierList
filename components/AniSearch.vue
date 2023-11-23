<template>
	<div>
		<button class="flex items-center justify-center" @click="toggleSearchBar" @keypress.prevent.ctrl.s="toggleSearchBar">
			<font-awesome-icon icon="fa-solid fa-search" size="lg" class="text-[rgba(191,193,212,.65)] hover:text-[#bcbedc] transition-colors duration-300 cursor-pointer"></font-awesome-icon>
		</button>

		<Transition name="slide-fade" mode="in-out" :duration="{ enter: 400, leave: 0 }">
			<div v-if="showSearchBar" class="absolute inset-0 z-50 flex justify-center top-24">
				<div class="fixed inset-0 z-0 bg-black opacity-50" @click="toggleSearchBar"></div>
				<div class="z-50 flex-col items-center justify-center w-full max-w-2xl gap-4 h-fit">
					<div id="searchbar" class="relative flex items-center p-4 mb-16 bg-white rounded-md">
						<font-awesome-icon icon="fa-solid fa-search" class="text-gray-400"></font-awesome-icon>
						<input v-model="content" type="text" class="w-full px-2 font-semibold outline-none grow" placeholder="Search an anime" @input="search" />
						<font-awesome-icon icon="fa-solid fa-times" class="text-gray-400 transition-colors cursor-pointer hover:text-aniPrimary" @click="toggleSearchBar"></font-awesome-icon>
						<!-- <span class="absolute right-0 text-xs top-16 text-aniWhite/75">Hint: Hit Ctrl-S to quickly toggle Quick Search</span> -->
					</div>

					<div v-if="results && content" class="flex-col overflow-x-hidden overflow-y-auto rounded-lg bg-aniWhite">
						<template v-for="result in results" :key="result.id">
							<div class="flex items-center w-full px-5 py-4 transition duration-200 ease-in cursor-pointer group gap-x-4 bg-aniWhite hover:bg-aniPrimary" @click="add(result.id)">
								<NuxtImg :src="result.coverImage.medium" width="64px" height="64px" class="object-cover w-16 h-16 rounded aspect-square" />
								<div class="flex flex-col grow gap-y-1 text-aniGray group-hover:text-aniWhite">
									<span class="font-bold">{{ result.title[userStore.getTitleLanguage.toLowerCase()] || result.title.userPreferred }}</span>
									<span class="text-xs font-semibold">{{ result.startDate.year }} • {{ result.format }}</span>
								</div>
								<span class="invisible flex h-8 w-8 aspect-square flex-none items-center justify-center rounded-full bg-white/25 text-[#1f81b2] group-hover:visible">
									<el-tooltip effect="dark" content="Add this anime to the tierlist" placement="right">
										<font-awesome-icon icon="fa-solid fa-plus" />
									</el-tooltip>
								</span>
							</div>
						</template>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
const content = ref("");
const showSearchBar = ref(false);
const userStore = useUserStore();
const tierStore = useTierStore();
const results = ref<any[]>([]);
const total = ref<number>(0);

const toggleSearchBar = () => {
	showSearchBar.value = !showSearchBar.value;
	results.value = [];
	content.value = "";
	total.value = 0;
};

const search = async () => {
	const { data } = await useAsyncGql({
		operation: "search",
		variables: { search: content.value },
	});
	results.value = data.value.anime?.results;
	total.value = data.value.anime?.pageInfo?.total;
};

async function add(id: number) {
	const { data } = await useAsyncGql({
		operation: "media",
		variables: { id: id },
	});
	const media = data.value.Media;
	const entry = {
		completedAt: null,
		score: null,
		media: media,
	};
	tierStore.addUnrankedTierEntry(entry);
	toggleSearchBar();
}
</script>

<style>
/* rules that target nested elements */
.slide-fade-enter-active #searchbar {
  transition: all 0.4s ease;
}

.slide-fade-enter-from #searchbar {
  transform: translateY(-30px);
  opacity: 0;
}

</style>