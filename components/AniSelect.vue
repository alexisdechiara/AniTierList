<template>
	<AniLabel :text="label">
		<template #input>
			<el-select v-model="value" placement="bottom" fit-input-width :suffix-icon="ElIconArrowDownBold" :clear-icon="ElIconCloseBold" :multiple="multiple" :disabled="disabled" :collapse-tags="multiple" class="min-w-[150px] max-w-[170px]" clearable placeholder="Any" @change="updateValue">
				<el-option v-for="item in options" :key="item.value" class="capitalize" :label="item.label" :value="item.value" />
			</el-select>
		</template>
	</AniLabel>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Option {
	value: string;
	label: string;
}

defineProps({
	label: {
		type: String,
		required: true,
	},
	white: {
		type: Boolean,
		required: false,
	},
	modelValue: {
		type: [Array<number>, Array<string>, String, Number],
		required: true,
	},
	options: {
		type: Array<Option>,
		required: true,
	},
	multiple: {
		type: Boolean,
		required: false,
		default: false,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const value = ref<Array<Option>>([]);

const emits = defineEmits(["update:modelValue"]);

function updateValue() {
	emits("update:modelValue", value.value);
}
</script>
