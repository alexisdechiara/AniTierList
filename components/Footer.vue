<template>
	<div class="mt-[20px] h-[286] w-full bg-[#11161d] px-[30px] py-[50px] text-[15px] font-semibold leading-relaxed text-[#a0b1c5]">
		<div class="mx-[90px] flex h-[186px] flex-col px-[50px] lg:flex-row">
			<div class="flex h-full w-full items-center justify-center text-[16px] font-bold text-[#3db4f2] lg:items-start lg:justify-start">This website is UNOFFICIAL and not related to Anilist.co</div>
			<div class="flex items-start justify-center space-x-12">
				<div class="flex h-full flex-col space-y-2">
					<h3 class="mb-[16px] text-xl font-bold">AniTierList</h3>
					<NuxtLink class="hover:text-[#3db4f2]" to="https://github.com/alexisdechiara/AniTierList">Github</NuxtLink>
					<NuxtLink class="hover:text-[#3db4f2]" to="/about">About</NuxtLink>
				</div>
				<div class="flex h-full flex-col space-y-2">
					<h3 class="mb-[16px] text-xl font-bold">AniList</h3>
					<NuxtLink class="hover:text-[#3db4f2]" to="https://anilist.co/">AniList.co</NuxtLink>
					<NuxtLink class="hover:text-[#3db4f2]" to="https://submission-manual.anilist.co/">Add Data</NuxtLink>
					<NuxtLink class="hover:text-[#3db4f2]" to="https://anilist.co/apps">Apps</NuxtLink>
					<NuxtLink class="hover:text-[#3db4f2]" to="https://github.com/AniList/ApiV2-GraphQL-Docs">API</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>
