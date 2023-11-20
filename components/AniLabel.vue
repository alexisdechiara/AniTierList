<template>
	<label :for="linkedTo" :class="{ 'text-capitalize block py-[10px] text-[15px] text-base font-semibold leading-[17px] text-[#516170]': linkedTo != null }">
		<span v-if="text != null" class="text-capitalize block py-[10px] text-[15px] text-base font-semibold leading-[17px] text-[#516170]">{{ text }}</span>
		<slot name="input"></slot>
	</label>
</template>

<script lang="ts" setup>
defineProps({
	text: {
		type: String,
		required: false,
		default: null,
	},
	linkedTo: {
		type: String,
		required: false,
		default: '',
	},
});
</script>
