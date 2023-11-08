<template>
	<div class="group relative">
		<NuxtImg loading="lazy" class="aspect-[2/3] z-0 flex h-full object-cover p-0" :src="content.media.coverImage.medium" width="100" height="150" alt="" />
		<el-popover placement="right" trigger="click" popper-style="padding:0;width:max-content;">
			<template #reference>
				<font-awesome-icon class="invisible absolute bottom-2 right-2 z-50 cursor-pointer rounded-full p-1 text-aniWhite hover:bg-aniWhite hover:text-aniGray group-hover:visible" icon="fa-solid fa-ellipsis-h" />
			</template>
			<div class="z-50 flex h-max w-[275px] justify-between overflow-hidden rounded-[3px] bg-aniWhite">
				<div class="flex h-full w-full flex-col bg-aniWhite">
					<div class="flex h-full grow flex-col gap-y-2 p-4">
						<div class="flex justify-between">
							<div class="flex flex-col gap-y-1">
								<span v-if="!content.isFranchise" class="text-xs font-semibold text-[#6E859E]">
									{{ content.media.format }}
									<span v-if="content.media.episodes && content.media.episodes > 1"> • {{ content.media.episodes }} episodes</span>
									<span v-else> • {{ getFormattedTime(content.media.duration) }}</span>
								</span>
								<NuxtLink :to="content.media.siteUrl" target="_blank" class="w-full flex-wrap pr-2 font-[Overpass] text-lg font-semibold leading-none text-aniGray hover:text-aniGray/75">{{ content.media.title.userPreferred }}</NuxtLink>
								<div class="inline text-xs font-bold leading-3 text-aniPrimary">
									<template v-for="(studio, index) in getMainStudios(content.media.studios.edges)" :key="studio.name">
										<NuxtLink :to="studio.node.siteUrl" target="_blank" class="hover:text-aniPrimary/75">
											{{ studio.node.name }}
										</NuxtLink>
										<span v-if="index < getMainStudios(content.media.studios.edges).length - 1">, </span>
									</template>
								</div>
							</div>
						</div>
						<el-scrollbar max-height="144px">
							<p class="text-[11px] font-medium leading-4 text-[#6E859E]" v-html="content.media.description"></p>
						</el-scrollbar>
						<div class="flex justify-center gap-x-2">
							<div class="my-2 grid grid-cols-2 gap-x-6 gap-y-4">
								<Stat title="Your score" :value="content.score + ' / 10'">
									<template #icon>
										<font-awesome-icon v-if="content.score >= 8" icon="far fa-smile" class="text-3xl text-aniGreen" />
										<font-awesome-icon v-else-if="content.score < 8 && content.score >= 6" icon="far fa-meh" class="text-3xl text-aniOrange" />
										<font-awesome-icon v-else icon="far fa-frown" class="text-3xl text-aniRed" />
									</template>
								</Stat>
								<Stat title="Ranking" :value="getRank(content.media.rankings)">
									<template #icon>
										<font-awesome-icon icon="fas fa-star" class="text-3xl text-aniYellow" />
									</template>
								</Stat>
								<Stat title="Average score" :value="content.media.averageScore + '%'">
									<template #icon>
										<font-awesome-icon v-if="content.score >= 8" icon="far fa-smile" class="text-3xl text-aniGreen" />
										<font-awesome-icon v-else-if="content.score < 8 && content.score >= 6" icon="far fa-meh" class="text-3xl text-aniOrange" />
										<font-awesome-icon v-if="content.score < 6" icon="far fa-frown" class="text-3xl text-aniRed" />
									</template>
								</Stat>
								<Stat title="Favorites" :value="content.media.favourites">
									<template #icon>
										<font-awesome-icon icon="fas fa-heart" class="text-3xl text-aniRed" />
									</template>
								</Stat>
							</div>
						</div>
						<div class="flex h-min justify-between">
							<template v-if="content.media.trailer">
								<div :style="`background-image: url(${content.media.trailer?.thumbnail})`" class="relative h-[100px] w-[178px] shrink cursor-pointer rounded bg-cover bg-[50%]" @click="isVideoOpened = true">
									<font-awesome-icon icon="far fa-play-circle" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-aniWhite" />
								</div>
								<el-dialog v-model="isVideoOpened" :show-close="false" align-center destroy-on-close class="trailer-wrapper">
									<iframe :src="'https://www.youtube.com/embed/' + content.media.trailer.id + '?autoplay=1&autohide=1'" allow="autoplay" frameborder="0" class="trailer"></iframe>
								</el-dialog>
							</template>
							<el-scrollbar max-height="100px">
								<div class="w-fit gap-1" :class="[content.media.trailer ? 'grid grid-cols-2' : 'flex flex-wrap']">
									<template v-for="link in content.media.externalLinks" :key="link.url">
										<ExternalLink :color="link.color" :url="link.url" :site="link.site" />
									</template>
								</div>
							</el-scrollbar>
						</div>
					</div>
					<div class="grid h-[44px] w-full grid-cols-3 items-center bg-[#EFF7FB] px-4">
						<div class="col-span-2 flex h-5 grow flex-wrap items-center gap-x-2 overflow-hidden">
							<span v-for="genre in content.media.genres" :key="genre" class="flex h-full items-center rounded-full bg-aniPrimary px-3 text-center align-middle text-xs font-bold leading-none text-aniWhite">{{ genre }}</span>
						</div>
						<div class="col-span-1 flex justify-end">
							<el-button type="danger" circle size="small" color="#E85D75" class="group" plain @click="$emit('deleted')">
								<font-awesome-icon icon="fas fa-trash" class="text-[10px] text-aniRed group-hover:text-aniWhite group-focus:text-aniWhite" />
							</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
import type { NuxtImg } from "nuxt/dist/app/components/nuxt-stubs";

defineProps<{
	content: any;
}>();

const isVideoOpened = ref(false);

const getRank = (rankings: any) => {
	let rank = "-";
	rankings.forEach((element: any) => {
		if (element.allTime && element.type === "RATED") {
			rank = element.rank;
		}
	});
	return rank;
};

const getMainStudios = (studios: Array<any>) => {
	const mainStudios: Array<any> = new Array<any>();
	studios.forEach((studio: any) => {
		if (studio.isMain) {
			mainStudios.push(studio);
		}
	});
	return mainStudios;
};

const getFormattedTime = (totalMinutes: number) => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`;
};
</script>

<style>
.el-scrollbar {
	--el-scrollbar-opacity: 0.4;
	--el-scrollbar-bg-color: var(--color-scroll-bar);
	--el-scrollbar-hover-opacity: 0.8;
	--el-scrollbar-hover-bg-color: var(--color-scroll-bar);
}

.trailer-wrapper {
	position: fixed;
	height: 45vw;
	left: 10vw !important;
	top: calc(50vh - 22.5vw) !important;
	width: 80vw;
	z-index: 999;
	overflow: hidden;
	border-radius: 4px;
	padding: 0;
}

.trailer-wrapper .el-dialog__body {
	padding: 0 !important;
	width: 100%;
	height: 100%;
}

.trailer-wrapper .el-dialog__header {
	display: none;
}

.trailer-wrapper .el-dialog__footer {
	display: none;
}

.trailer {
	width: 100%;
	height: 100%;
}
</style>
