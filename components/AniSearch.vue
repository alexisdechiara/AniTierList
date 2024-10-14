<template>
	<div>
		<button class="flex items-center justify-center" @click="toggleSearchBar" @keypress.prevent.ctrl.s="toggleSearchBar">
			<font-awesome-icon icon="fa-solid fa-search" size="lg" class="cursor-pointer text-[rgba(191,193,212,.65)] transition-colors duration-300 hover:text-[#bcbedc]" />
		</button>

		<Transition name="slide-fade" mode="in-out" :duration="{ enter: 400, leave: 0 }">
			<div v-if="showSearchBar" class="absolute inset-0 top-24 z-50 flex justify-center">
				<div class="fixed inset-0 z-0 bg-black opacity-50" @click="toggleSearchBar" />
				<div class="z-50 h-fit w-full max-w-2xl flex-col items-center justify-center gap-4">
					<div id="searchbar" class="relative mb-16 flex items-center rounded-md bg-white p-4">
						<font-awesome-icon icon="fa-solid fa-search" class="text-gray-400" />
						<input v-model="content" type="text" class="w-full grow px-2 font-semibold outline-none" placeholder="Search an anime" @input="search">
						<font-awesome-icon icon="fa-solid fa-times" class="cursor-pointer text-gray-400 transition-colors hover:text-aniPrimary" @click="toggleSearchBar" />
						<!-- <span class="absolute right-0 text-xs top-16 text-aniWhite/75">Hint: Hit Ctrl-S to quickly toggle Quick Search</span> -->
					</div>

					<div v-if="results && content" class="flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-aniWhite">
						<template v-for="result in results" :key="result.id">
							<div class="group flex w-full cursor-pointer items-center gap-x-4 bg-aniWhite px-5 py-4 transition duration-200 ease-in hover:bg-aniPrimary" @click="add(result.id)">
								<NuxtImg :src="result.coverImage.medium" width="64px" height="64px" class="aspect-square size-16 rounded object-cover" />
								<div class="flex grow flex-col gap-y-1 text-aniGray group-hover:text-aniWhite">
									<span class="font-bold">{{ result.title[userStore.getTitleLanguage.toLowerCase()] || result.title.userPreferred }}</span>
									<span class="text-xs font-semibold">{{ result.startDate.year }} • {{ result.format }}</span>
								</div>
								<span class="aspect-square invisible flex size-8 flex-none items-center justify-center rounded-full bg-white/25 text-[#1f81b2] group-hover:visible">
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
const content = ref("")
const showSearchBar = ref(false)
const userStore = useUserStore()
const tierStore = useTierStore()
const results = ref<any[]>([])
const total = ref<number>(0)

const toggleSearchBar = () => {
	showSearchBar.value = !showSearchBar.value
	results.value = []
	content.value = ""
	total.value = 0
}

const search = async () => {
	const { data } = await useAsyncGql({
		operation: "search",
		variables: { search: content.value },
	})
	results.value = data.value.anime?.results as any[]
	total.value = data.value.anime?.pageInfo?.total as number
}

async function add(id: number) {
	const { data } = await useAsyncGql({
		operation: "media",
		variables: { id: id },
	})
	const media = data.value.Media
	const entry = {
		completedAt: null,
		score: null,
		media: media,
	}
	tierStore.addUnrankedTierEntry(entry)
	toggleSearchBar()
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
