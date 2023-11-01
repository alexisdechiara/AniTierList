<template>
	<div class="flex w-full items-center gap-x-2 font-bold text-aniGray">
		<slot name="icon"></slot>
		<div class="flex grow flex-col justify-between">
			<span class="text-[10px] font-black leading-normal">{{ title }}</span>
			<span class="text-base leading-none">{{ value }}</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		required: true,
	},
	value: {
		type: [Number, String],
		default: "-",
		required: false,
	},
});
</script>
