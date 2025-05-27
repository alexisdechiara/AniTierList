<template>
	<div class="flex min-h-[150px] flex-col">
		<draggable
			v-if="unrankedTier.length > 0"
			v-model="unrankedTier"
			class="flex w-full flex-row flex-wrap"
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
			<template #item="{ element }">
				<Item v-if="shouldDisplayItem(element)" :content="element" class="cursor-move" @deleted="removeAt(element)" />
			</template>
		</draggable>
		<el-empty v-if="unrankedTier.filter(shouldDisplayItem).length === 0" description="No anime found, please check the filters or username" />
	</div>
</template>

<script setup>
import draggable from "vuedraggable"
import { computed } from "vue" // computed might still be needed for itemsToDisplayCount or similar

const tierStore = useTierStore()
const filterStore = useFilterStore()
const userStore = useUserStore()
const { unrankedTier } = storeToRefs(tierStore)

function removeAt(element) { // Changed 'index' to 'element'
	const originalIndex = unrankedTier.value.findIndex(item => item.media.id === element.media.id);
	if (originalIndex !== -1) {
		unrankedTier.value.splice(originalIndex, 1);
	}
}

// checkAll function is removed

function checkYear(year) {
	if (filterStore.getYears.length > 0) {
		return filterStore.getYears.includes(year)
	}
	else return true
}

function checkSeason(season) {
	if (filterStore.getSeasons.length > 0) {
		return filterStore.getSeasons.includes(season)
	}
	else return true
}

function checkFormat(format) {
	if (filterStore.getFormats.length > 0) {
		return filterStore.getFormats.includes(format)
	}
	else return true
}

function checkGenre(genres) {
	if (filterStore.getGenres.length > 0) {
		return filterStore.getGenres.genres.every(e => genres.includes(e))
	}
	else return true
}

function checkTitle(title) {
	if (filterStore.getSearch != "") {
		let result = false
		for (const key in title) {
			if (title[key] != null) {
				if (title[key].toLowerCase().includes(filterStore.getSearch.toLowerCase())) {
					result = true
				}
			}
		}
		return result
	}
	else return true
}

function checkScore(score) {
	// if (score) {
	// 	return filterStore.getMinimumRange <= score && score <= filterStore.getMaximumRange;
	// } else return true;
	return true
}

function shouldDisplayItem(element) {
  console.count('shouldDisplayItem calls');
  // const perfKey = `shouldDisplayItem ${element.media.id}`; // As per instructions, time is too noisy.
  // console.time(perfKey);

  const isVisible = checkTitle(element.media.title) &&
         checkYear(element.media.seasonYear) &&
         checkSeason(element.media.season) &&
         checkFormat(element.media.format) &&
         checkGenre(element.media.genres) &&
         checkScore(element.score);
  
  // console.timeEnd(perfKey);
  return isVisible;
}

// No longer using filteredUnrankedTier, vuedraggable uses v-model="unrankedTier"
// and v-if="shouldDisplayItem(element)" handles visibility.
// The el-empty condition directly uses unrankedTier.filter(shouldDisplayItem).length.
// If performance becomes an issue with the .filter in the template,
// a computed property for displayableItemsCount could be added.
// For now, let's stick to the direct approach as per the plan.
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
