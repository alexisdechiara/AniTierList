<template>
	<div v-if="filterStore.getSearch || filterStore.getYears.length > 0 || filterStore.getSeasons.length > 0 || filterStore.getFormats.length > 0 || filterStore.getGenres.length > 0" class="flex flex-row items-center mb-8">
		<font-awesome-icon icon="fas fa-tags" class="mr-[16px] h-[20px] w-[20px] text-[#afbfd1]" />
		<div class="flex flex-row flex-wrap space-x-4">
			<el-tag v-if="filterStore.search != ''" closable effect="dark" @close="filterStore.search = ''">{{ filterStore.search }}</el-tag>
			<el-tag v-for="(year, index) in filterStore.getYears" :key="year" closable effect="dark" @close="filterStore.removeYearByIndex(index)">{{ year }}</el-tag>
			<el-tag v-for="(season, index) in filterStore.getSeasons" :key="season" closable effect="dark" @close="filterStore.removeSeasonByIndex(index)">{{ season }}</el-tag>
			<el-tag v-for="(format, index) in filterStore.getFormats" :key="format" closable effect="dark" @close="filterStore.removeFormatByIndex(index)">{{ format }}</el-tag>
			<el-tag v-for="(genre, index) in filterStore.getGenres" :key="genre" closable effect="dark" @close="filterStore.removeGenreByIndex(index)">{{ genre }}</el-tag>
		</div>
	</div>
</template>

<script setup lang="ts">
const filterStore = useFilterStore();
</script>