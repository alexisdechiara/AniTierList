<template>
	<div class="flex h-[68px] w-full justify-center bg-[#2b2d42]">
		<div class="mx-[50px] flex w-[1050px] items-center">
			<NuxtLink to="/">
				<NuxtImg class="h-[50px]" src="img/logo.svg" alt="AniTierList icon" />
			</NuxtLink>
		</div>

		<div v-if="userStore.getUser.isLogged" class="flex items-center gap-x-4">
			<AniSearch />
			<el-popover placement="bottom" :width="200" trigger="hover" popper-style="border-radius:6px;padding:0">
				<template #reference>
					<div class="flex items-center outline-none cursor-pointer w-fit ring-0">
						<NuxtImg class="h-[38px]" :src="userStore.getUser.avatar.medium || `https://ui-avatars.com/api/?name=${userStore.getUser.username}`" />
						<font-awesome-icon class="w-3 h-3 ml-2 text-aniWhite" icon="fa-solid fa-chevron-down"/>
					</div>
				</template>
				<div class="cursor-pointer">
					<div class="flex flex-col gap-4 py-5 text-sm px-7">
						<NuxtLink class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" :to="userStore.getUser.url" target="_blank"><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon>Profile</NuxtLink>
						<span class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" @click="openDialog()"><font-awesome-icon icon="fa-solid fa-cog"></font-awesome-icon>Settings</span>
					</div>
					<div class="py-4 px-7 bg-[#edf1f5] text-xs grid grid-cols-2 gap-2">
						<span class="flex w-full items-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#657481] justify-center" @click="reset($route.fullPath)"><font-awesome-icon icon="fa-solid fa-sync-alt"></font-awesome-icon>Reset</span>
						<NuxtLink class="flex w-full items-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#657481] justify-center" to="/" @click="userStore.$reset()"><font-awesome-icon icon="fa-solid fa-sign-out-alt"></font-awesome-icon>Logout</NuxtLink>
					</div>
				</div>
			</el-popover>
		</div>
	</div>

	<el-dialog v-model="isOpen" title="Settings">
		<el-form label-position="top">
			<el-form-item label="Language">
				<el-select v-model="localLanguage" fit-input-width class="w-full ani-select-template">
					<el-option label="Romaji (Shingeki no Kyojin)" value="ROMAJI" />
					<el-option label="English (Attack on Titan)" value="ENGLISH" />
					<el-option label="Native (進撃の巨人)" value="NATIVE" />
				</el-select>
			</el-form-item>
			<el-form-item label="Scoring System">
				<el-select v-model="localScoreFormat" fit-input-width class="w-full ani-select-template">
					<el-option label="100 point (55/100)" value="POINT_100" />
					<el-option label="10 Point Decimal (5,5/10)" value="POINT_10_DECIMAL" />
					<el-option label="10 Point (5/10)" value="POINT_10" />
					<el-option label="5 Star (3/5)" value="POINT_5" />
					<el-option label="3 Point Smiley :)" value="POINT_3" />
				</el-select>
			</el-form-item>
			<el-form-item label="Default List Order" > <!-- TODO add this to store-->
				<el-select v-model="localRowOrder" fit-input-width class="w-full ani-select-template">
					<el-option label="Score" value="Score" />
					<el-option label="Title" value="Title" />
					<el-option label="Last Updated" value="Last Updated" />
					<el-option label="last Added" value="Last Added" />
				</el-select>
			</el-form-item>
			<div class="flex w-full">
      <el-button type="primary" class="w-full" @click="onSubmit">Validate</el-button>
      <el-button type="danger" plain @click="onCancel">Cancel</el-button>
    	</div>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
const tierStore = useTierStore()
const filterStore = useFilterStore()

const isOpen = ref(false)

function reset(path: string) {
	userStore.$reset()
	tierStore.$reset()
	filterStore.$reset()
	ElLoading.service({ lock: true, text:'Please wait for reloading' })
	reloadNuxtApp({
		path: path,
		ttl: 1000, 
	});
}

const localLanguage = ref()
const localScoreFormat  = ref()
const localRowOrder = ref('')

function openDialog() {
	isOpen.value = true
	localLanguage.value = userStore.titleLanguage
	localScoreFormat.value = userStore.scoreFormat
	localRowOrder.value = userStore.rowOrder
}

function onCancel() {
	isOpen.value = false
}

function onSubmit() {
	userStore.titleLanguage = localLanguage.value
	if (userStore.scoreFormat != localScoreFormat.value || userStore.rowOrder != localRowOrder.value) {
		userStore.scoreFormat = localScoreFormat.value
		userStore.rowOrder = localRowOrder.value
		//TODO fetch new datas
	}
	isOpen.value = false
}

</script>