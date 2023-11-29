<template>
	<aniLoader v-if="pageStore.getIsLoading" fullpage/>
	<div v-else class="bg-aniBody" >
		<Header />
		<NuxtPage/>
		<Footer />
	</div>
</template>

<script lang="ts" setup>
const pageStore = usePageStore();
</script>