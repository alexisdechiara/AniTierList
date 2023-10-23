<template>
	<div v-if="modelValue.search != '' || modelValue.year != '' || modelValue.season != '' || modelValue.formats.length > 0 || modelValue.genres.length > 0" class="mb-8 flex flex-row items-center">
		<font-awesome-icon icon="fas fa-tags" class="h-[20px] w-[20px] text-[#afbfd1] mr-[16px]" />
		<div class="flex flex-row flex-wrap space-x-4">
			<el-tag v-if="modelValue.search != ''" type="primary" closable effect="dark" @close="modelValue.search = ''">{{ modelValue.search }}</el-tag>
			<el-tag v-if="modelValue.year != ''" type="primary" closable effect="dark" @close="modelValue.year = ''">{{ modelValue.year }}</el-tag>
			<el-tag v-if="modelValue.season != ''" type="primary" closable effect="dark" @close="modelValue.season = ''">{{ modelValue.season }}</el-tag>
			<el-tag v-for="format, index in modelValue.formats" :key="format.value" type="primary" closable effect="dark" @close="removeFilteredFormat(index)">{{ format }}</el-tag>
			<el-tag v-for="genre, index in modelValue.genres" :key="genre.value" type="primary" closable effect="dark" @close="removeFilteredGenre(index)">{{ genre }}</el-tag>
		</div>
	</div>
</template>

<script>

import { ElTag } from 'element-plus';
export default {
	name: "AniTags",
	components: {
		ElTag
	},
	props: {
		modelValue: Object
	},
	methods: {
		removeFilteredFormat(index) {
			this.modelValue.formats.splice(index, 1);
		},
		removeFilteredGenre(index) {
			this.modelValue.genres.splice(index, 1);
		},
	},
};
</script>