<template>
	<label :for="linkedTo" :class="{ 'text-capitalize block py-[10px] text-[15px] text-base font-semibold leading-[17px] text-[#516170]': linkedTo != null }">
		<span v-if="text != null" class="text-capitalize block py-[10px] text-[15px] text-base font-semibold leading-[17px] text-[#516170]">{{ text }}</span>
		<slot name="input"></slot>
	</label>
</template>

<script>
export default {
	name: "AniLabel",
	props: {
		text: String,
		linkedTo: String,
	},
	data() {
		return {};
	},
	created() {},
	methods: {},
};
</script>
