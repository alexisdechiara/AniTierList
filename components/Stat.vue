<template>
	<div class="flex items-center w-full font-bold gap-x-2 text-aniGray">
	<slot name="icon"></slot>
		<div class="flex flex-col justify-between grow">
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
