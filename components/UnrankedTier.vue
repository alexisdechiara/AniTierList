<template>
	<div class="flex min-h-[150px] flex-col">
		<draggable
			v-if="unrankedTier.length > 0"
			:list="unrankedTier"
			class="flex flex-row flex-wrap w-full"
			item-key="media.id"
			group="tier"
			:animation="userStore.displayTransition ? '150' : '0'"
			ghost-class="ghost"
			tag="transition-group"
			:component-data="{
				tag: 'div',
				type: 'transition-group',
				name: !drag && userStore.displayTransition ? 'flip-list' : 'no-move',
			}"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element, index }">
				<Item v-show="checkAll(element)" :content="element" class="cursor-move" @deleted="removeAt(index)" />
			</template>
		</draggable>
		<el-empty v-else description="No anime found, please check the username" />
	</div>
</template>

<script setup>
import draggable from "vuedraggable";
const tierStore = useTierStore();
const filterStore = useFilterStore();
const userStore = useUserStore();
const { unrankedTier } = storeToRefs(tierStore);

function removeAt(index) {
	unrankedTier.value.splice(index, 1);
}

function checkAll(element) {
	return checkTitle(element.media.title) && checkYear(element.media.seasonYear) && checkSeason(element.media.season) && checkFormat(element.media.format) && checkGenre(element.media.genres) && checkScore(element.score);
}
function checkYear(year) {
	if (filterStore.getYears.length > 0) {
		return filterStore.getYears.includes(year);
	} else return true;
}

function checkSeason(season) {
	if (filterStore.getSeasons.length > 0) {
		return filterStore.getSeasons.includes(season);
	} else return true;
}

function checkFormat(format) {
	if (filterStore.getFormats.length > 0) {
		return filterStore.getFormats.includes(format);
	} else return true;
}

function checkGenre(genres) {
	if (filterStore.getGenres.length > 0) {
		return filterStore.getGenres.genres.every((e) => genres.includes(e));
	} else return true;
}

function checkTitle(title) {
	if (filterStore.getSearch != "") {
		let result = false;
		for (const key in title) {
			if (title[key] != null) {
				if (title[key].toLowerCase().includes(filterStore.getSearch.toLowerCase())) {
					result = true;
				}
			}
		}
		return result;
	} else return true;
}

function checkScore(score) {
	// if (score) {
	// 	return filterStore.getMinimumRange <= score && score <= filterStore.getMaximumRange;
	// } else return true;
	return true;
}
</script>

<style>
.flip-list-move {
	transition: transform 0.5s;
}

.no-move {
	transition: transform 0s;
}

.ghost {
	opacity: 0.5;
}

.list-group-item {
	cursor: move;
}

.list-group-item i {
	cursor: pointer;
}
</style>
