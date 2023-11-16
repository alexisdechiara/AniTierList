<template>
	<div class="flex h-[68px] w-full justify-center bg-[#2b2d42]">
		<div class="mx-[50px] flex w-[1050px] items-center">
			<NuxtLink to="/">
				<NuxtImg class="h-[50px]" src="img/logo.svg" alt="AniTierList icon" />
			</NuxtLink>
		</div>
		<el-popover v-if="userStore.getUser.isLogged" placement="bottom" :width="200" trigger="hover" popper-style="border-radius:6px;padding:0">
			<template #reference>
				<div class="flex items-center w-fit ring-0 outline-none cursor-pointer">
					<NuxtImg class="h-[50px]" :src="userStore.getUser.avatar.medium || `https://ui-avatars.com/api/?name=${userStore.getUser.username}`" />
					<font-awesome-icon class="ml-2 text-aniWhite" icon="fa-solid fa-chevron-down" />
				</div>
			</template>
			<div class="cursor-pointer">
				<div class="flex flex-col gap-4 px-7 py-5 text-sm">
					<NuxtLink class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" :to="userStore.getUser.url" target="_blank"><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon>Profile</NuxtLink>
					<NuxtLink class="flex w-full items-center gap-2 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c]" to="/" target="_blank"><font-awesome-icon icon="fa-solid fa-cog"></font-awesome-icon>Settings</NuxtLink>
				</div>
				<div class="py-4 px-7 bg-[#edf1f5] text-xs grid grid-cols-2 gap-2">
					<NuxtLink class="flex w-full items-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c] justify-center" :to="userStore.getUser.username" target="_blank"><font-awesome-icon icon="fa-solid fa-sync-alt"></font-awesome-icon>Refresh</NuxtLink>
					<NuxtLink class="flex w-full items-center gap-1 font-semibold text-[#8BA0B2] hover:text-[#7a8c9c] justify-center" to="/" target="_blank"><font-awesome-icon icon="fa-solid fa-sign-out-alt"></font-awesome-icon>Logout</NuxtLink>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
</script>