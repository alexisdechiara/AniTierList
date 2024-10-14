<template>
	<div class="flex h-[68px] w-full justify-center bg-[#2b2d42]">
		<div class="flex w-full max-w-5xl items-center justify-between">
			<NuxtLink to="/">
				<NuxtImg class="h-[50px]" src="/img/logo.svg" loading="lazy" :placeholder="[25, 25]" alt="AniTierList icon" />
			</NuxtLink>

			<div v-if="route.params.username" class="flex items-center gap-x-6">
				<AniSearch />
				<el-popover v-if="userStore.getUser.isLogged" placement="bottom" :width="200" trigger="hover" popper-style="border-radius:6px;padding:0">
					<template #reference>
						<div class="flex w-fit cursor-pointer items-center gap-x-0.5 outline-none ring-0">
							<NuxtImg class="h-[38px]" :src="userStore.getUser.avatar?.medium || `https://ui-avatars.com/api/?name=${userStore.getUser.username}`" />
							<font-awesome-icon class="ml-2 cursor-pointer text-[rgba(191,193,212,.65)] transition-colors duration-300 hover:text-[#bcbedc]" size="xs" icon="fa-solid fa-chevron-down" />
						</div>
					</template>
					<div class="cursor-pointer">
						<div class="flex flex-col gap-4 px-7 py-5 text-sm">
							<NuxtLink class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" :to="userStore.getUser.url" target="_blank">
								<font-awesome-icon icon="fa-solid fa-user" />Profile
							</NuxtLink>
							<Settings button-class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" icon="fa-solid fa-cog" />
						</div>
						<div class="grid grid-cols-2 gap-2 bg-aniBody px-7 py-4 text-xs">
							<span class="flex w-full items-center justify-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#657481]" @click="reset($route.fullPath)"><font-awesome-icon icon="fa-solid fa-sync-alt" />Reset</span>
							<NuxtLink class="flex w-full items-center justify-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#657481]" to="/" @click="userStore.$reset()">
								<font-awesome-icon icon="fa-solid fa-sign-out-alt" />Logout
							</NuxtLink>
						</div>
					</div>
				</el-popover>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
const tierStore = useTierStore()
const filterStore = useFilterStore()
const pageStore = usePageStore()

const route = useRoute()

function reset(path: string) {
	userStore.$reset()
	tierStore.$reset()
	filterStore.$reset()
	pageStore.setIsLoading(true)
	reloadNuxtApp({
		path: path,
		ttl: 1000,
	})
}
</script>
