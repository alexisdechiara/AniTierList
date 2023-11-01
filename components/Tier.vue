<template>
	<div class="flex min-h-[150px] flex-row">
		<contenteditable v-if="name != null" v-model="value" tag="div" :contenteditable="isEditable" :no-nl="true" :no-html="true" :style="'background-color:' + color" class="break-word flex min-h-[150px] w-[200px] basis-auto items-center justify-center text-center text-3xl font-bold text-white focus:outline-none" @dblclick="isEditable = true" @focusout="isEditable = false" @returned="enterPressed()" />
		<draggable class="flex w-full flex-row flex-wrap" :group="group" :list="entries" item-key="media.id">
			<template #item="{ element, index }">
				<Item v-show="checkAll(element)" :content="element" @deleted="removeAt(index)" />
			</template>
		</draggable>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import contenteditable from "vue-contenteditable";

export default {
	name: "Tier",
	components: {
		draggable,
		contenteditable,
	},
	props: {
		name: String,
		color: String,
		entries: Array,
		group: String,
		transition: Boolean,
		filters: Object,
	},
	data() {
		return {
			isEditable: false,
			value: this.name,
			showDetail: false,
		};
	},
	computed: {
		dragOptions() {
			return {
				animation: 100,
				group: "description",
				disabled: false,
				ghostClass: "ghost",
			};
		},
	},
	methods: {
		enterPressed() {
			this.$emit("update:value", this.value);
		},
		removeAt(index) {
			this.entries.splice(index, 1);
		},
		checkAll(element) {
			return this.checkTitle(element.media.title) && this.checkYear(element.media.seasonYear) && this.checkSeason(element.media.season) && this.checkFormat(element.media.format) && this.checkGenre(element.media.genres) && this.checkScore(element.score) && this.checkIsSequel(element.media.relations.edges);
		},
		checkYear(year) {
			if (this.filters.year != "") {
				return year == this.filters.year;
			} else return true;
		},
		checkSeason(season) {
			if (this.filters.season != "") {
				return season == this.filters.season;
			} else return true;
		},
		checkFormat(format) {
			if (this.filters.formats.length > 0) {
				return this.filters.formats.some((FilteredFormat) => FilteredFormat == format);
			} else return true;
		},
		checkGenre(genres) {
			if (this.filters.genres.length > 0) {
				return this.filters.genres.every((e) => genres.includes(e));
			} else return true;
		},
		checkTitle(title) {
			if (this.filters.search != "") {
				let result = false;
				for (const key in title) {
					if (title[key] != null) {
						if (title[key].toLowerCase().includes(this.filters.search)) {
							result = true;
						}
					}
				}
				return result;
			} else return true;
		},
		checkScore(score) {
			if (score != 0) {
				return this.filters.range[0] <= score && score <= this.filters.range[1];
			} else return false;
		},
		checkIsSequel(edges) {
			if (this.filters.seasons === false) {
				return !edges.some((edge) => edge.relationType == "PREQUEL");
			} else {
				return true;
			}
		},
	},
};
</script>
