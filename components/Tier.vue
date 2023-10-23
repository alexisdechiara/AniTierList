<template>
	<div class="flex flex-row min-h-[150px]">
		<contenteditable @dblclick="isEditable = true" @focusout="isEditable = false" tag="div" :contenteditable="isEditable" v-model="value" :no-nl="true" :no-html="true" @returned="enterPressed()" v-if="name != null" :style="'background-color:' + color" class="flex break-word basis-auto min-h-[150px] w-[200px] text-white text-center justify-center items-center font-bold text-3xl" />
		<draggable class="flex flex-wrap flex-row w-full" :group="group" :list="entries" item-key="media.id">
			<template #item="{ element }">
				<img v-show="checkAll(element)" class="flex aspect-[2/3] object-cover h-[150px]" :src="element.media.coverImage.medium" alt="">
			</template>
		</draggable>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import contenteditable from 'vue-contenteditable';

export default {
	name: "Tier",
	components: {
		draggable,
		contenteditable
	},
	data() {
		return {
			isEditable: false,
			value: this.name,
		}
	},
	props: {
		name: String,
		color: String,
		entries: Array,
		group: String,
		transition: Boolean,
		filters: Object,
	},
	methods: {
		enterPressed() {
			this.$emit('update:value', this.value)
		},
		checkAll(element) {
			return (
				this.checkTitle(element.media.title) &&
				this.checkYear(element.media.seasonYear) &&
				this.checkSeason(element.media.season) &&
				this.checkFormat(element.media.format) &&
				this.checkGenre(element.media.genres) &&
				this.checkScore(element.score) &&
				this.checkIsSequel(element.media.relations.edges)
			)
		},
		checkYear(year) {
			if (this.filters.year != '') {
				return year == this.filters.year;
			} else return true
		},
		checkSeason(season) {
			if (this.filters.season != '') {
				return season == this.filters.season;
			} else return true
		},
		checkFormat(format) {
			if (this.filters.formats.length > 0) {
				return this.filters.formats.some(FilteredFormat => FilteredFormat == format);
			} else return true
		},
		checkGenre(genres) {
			if (this.filters.genres.length > 0) {
				return this.filters.genres.every(e => genres.includes(e));
			} else return true
		},
		checkTitle(title) {
			if (this.filters.search != '') {
				let result = false;
				for (const key in title) {
					if (title[key] != null) {
						if (title[key].toLowerCase().includes(this.filters.search)) {
							result = true;
						}
					}
				}
				return result;
			} else return true
		},
		checkScore(score) {
			if (score != 0) {
				return this.filters.range[0] <= score && score <= this.filters.range[1];
			} else return false
		},
		checkIsSequel(edges) {
			if (this.filters.seasons === false) {
				return !edges.some(edge => edge.relationType == 'PREQUEL');
			} else {
				return true;
			}
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 100,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
	}
}
</script>