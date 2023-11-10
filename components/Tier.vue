<template>
	<div class="flex min-h-[150px] flex-row">
		<contenteditable v-if="name != null" v-model="value" tag="div" :contenteditable="isEditable" :no-nl="true" :no-html="true" :style="'background-color:' + color" class="break-word flex min-h-[150px] w-[200px] basis-auto items-center justify-center text-center text-3xl font-bold text-white focus:outline-none" @dblclick="isEditable = true" @focusout="isEditable = false" @returned="enterPressed()" />
		<draggable class="flex flex-row flex-wrap w-full" group="tier" :list="entries" item-key="media.id">
			<template #item="{ element, index }">
				<Item v-show="checkAll(element)" :content="element" @deleted="removeAt(index)" />
			</template>
		</draggable>
	</div>
</template>

<script setup>
import draggable from "vuedraggable";
import contenteditable from "vue-contenteditable";

		const props = defineProps({
			name: String,
			color: String,
			entries: Array,
		});


		const filterStore = useFilterStore();
		const emit = defineEmits(["update:value"]);
		const isEditable = ref(false);
		const value = ref(props.name);

		function enterPressed() {
			emit("update:value", value.value);
		}
		
		function removeAt(index) {
			entries.value.splice(index, 1);
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
			return filterStore.getMinimumRange <= score && score <= filterStore.getMaximumRange;
		}
</script>
