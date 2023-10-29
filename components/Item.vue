<template>
	<div class="relative group">
		<NuxtImg loading="lazy" class="z-0 flex object-cover h-full p-0 aspect-w-2 aspect-h-3" :src="content.media.coverImage.medium" width="100" height="150" alt="" />
		<el-popover placement="right" trigger="click" popper-style="padding:0;width:max-content;">
			<template #reference>
				<font-awesome-icon class="absolute invisible p-1 rounded-full cursor-pointer group-hover:visible z-5 text-aniWhite bottom-2 right-2 hover:bg-aniWhite hover:text-aniGray" icon="fa-solid fa-ellipsis-h" />
			</template>
			<div class="z-50 flex justify-between overflow-hidden rounded-[3px] h-max w-min min-w-[275px] bg-aniWhite">
				<div class="flex flex-col w-full h-full bg-aniWhite">
				<div class="flex flex-col h-full p-4 gap-y-2 grow">
					<div class="flex justify-between">
						<div class="flex flex-col gap-y-1">
							<span class="text-xs font-semibold text-[#6E859E]">{{ content.media.format }}</span>
							<span class="font-[Overpass] font-semibold text-lg leading-none text-aniGray flex-nowrap w-max pr-2">{{ content.media.title.userPreferred }}</span>
							<div class="leading-3">
								<template v-for="studio in content.media.studios.edges" :key="studio.name">
									<NuxtLink v-if="studio.isMain" :to="studio.node.siteUrl" class="inline text-xs font-bold text-aniPrimary hover:text-aniPrimary/75">
										{{ studio.node.name }} &nbsp;
									</NuxtLink>
								</template>
							</div>
						</div>
					</div>
					<el-scrollbar class="overflow-auto max-h-36">
						<p class="text-[11px] leading-4 text-[#6E859E] font-medium" v-html="content.media.description"></p>
					</el-scrollbar>
					<div class="flex justify-center">
						<div class="grid grid-cols-2 gap-y-4 gap-x-6">
							<Stat title="Your score" :value="content.score + ' / 10'">
								<template #icon>
									<font-awesome-icon icon="far fa-smile" v-if="content.score >= 8" class="text-3xl text-aniGreen" />
									<font-awesome-icon icon="far fa-meh" v-else-if="content.score < 8 && content.score >= 6" class="text-3xl text-aniOrange" />
									<font-awesome-icon icon="far fa-frown" v-else="content.score < 6" class="text-3xl text-aniRed" />
								</template>
							</Stat>
							<Stat title="Ranking" :value="getRank(content.media.rankings)">
								<template #icon>
									<font-awesome-icon icon="fas fa-star" class="text-3xl text-aniYellow" />
								</template>
							</Stat>
							<Stat title="Average score" :value="content.media.averageScore + '%'">
								<template #icon>
									<font-awesome-icon icon="far fa-smile" v-if="content.score >= 8" class="text-3xl text-aniGreen" />
									<font-awesome-icon icon="far fa-meh" v-else-if="content.score < 8 && content.score >= 6" class="text-3xl text-aniOrange" />
									<font-awesome-icon icon="far fa-frown" v-if="content.score < 6" class="text-3xl text-aniRed" />
								</template>
							</Stat>
							<Stat title="Favorites" :value="content.media.favourites">
								<template #icon>
									<font-awesome-icon icon="fas fa-heart" class="text-3xl text-aniRed" />
								</template>
							</Stat>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-3 w-full items-center bg-[#EFF7FB] px-4 h-[44px]">
					<div class="flex flex-wrap items-center h-5 col-span-2 overflow-hidden grow gap-x-2">
						<span v-for="genre in content.media.genres" class="flex items-center h-full px-3 text-xs font-bold leading-5 text-center align-middle rounded-full bg-aniPrimary text-aniWhite" :key="genre">{{ genre }}</span>
					</div>
					<div class="flex justify-end col-span-1">
						<button class="flex justify-center items-center bg-[#E85D75] h-5 w-5 rounded-full cursor-pointer">
							<font-awesome-icon @click="$emit('deleted');" icon="fas fa-trash" class="text-aniWhite text-[10px]" />
						</button>
					</div>
				</div>
			</div>
		</div>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
import type { NuxtImg } from 'nuxt/dist/app/components/nuxt-stubs';

const props = defineProps<{
	content: Object,
}>()

//Get the rank of all time
const getRank = (rankings: any) => {
	let rank = "-"
	rankings.forEach(element => {
		if(element.allTime && element.type ==='RATED') {
			rank = element.rank
		}
	});
	return rank
}

</script>


