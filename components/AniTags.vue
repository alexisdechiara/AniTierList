<template>
	<div v-if="store.filters.search != '' || store.filters.year != '' || store.filters.season != '' || store.filters.formats.length > 0 || store.filters.genres.length > 0" class="mb-8 flex flex-row items-center">
		<font-awesome-icon icon="fas fa-tags" class="mr-[16px] h-[20px] w-[20px] text-[#afbfd1]" />
		<div class="flex flex-row flex-wrap space-x-4">
			<el-tag v-if="store.filters.search != ''" closable effect="dark" @close="store.filters.search = ''">{{ store.filters.search }}</el-tag>
			<el-tag v-if="store.filters.year != ''" closable effect="dark" @close="store.filters.year = ''">{{ store.filters.year }}</el-tag>
			<el-tag v-if="store.filters.season != ''" closable effect="dark" @close="store.filters.season = ''">{{ store.filters.season }}</el-tag>
			<el-tag v-for="(format, index) in store.filters.formats" :key="format" closable effect="dark" @close="removeFilteredFormat(index)">{{ format }}</el-tag>
			<el-tag v-for="(genre, index) in store.filters.genres" :key="genre" closable effect="dark" @close="removeFilteredGenre(index)">{{ genre }}</el-tag>
		</div>
	</div>
</template>
<script setup lang="ts">
const store = useEntriesStore();

const removeFilteredFormat = (index: number) => {
  store.filters.formats.splice(index, 1);
};

const removeFilteredGenre = (index: number) => {
  store.filters.genres.splice(index, 1);
};
</script>