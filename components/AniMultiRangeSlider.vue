<template>
	<el-slider class="w-full" v-model="value" @input="updateValue()" :disabled="disabled" range :marks="marks" :min="0" :step="0.1" show-stops :max="10" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { CSSProperties } from "vue";

interface Mark {
	style: CSSProperties;
	label: string;
}

const props = defineProps({
	modelValue: Array,
	disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function updateValue() {
	emit("update:modelValue", [value._rawValue[0], value._rawValue[1]]);
}

type Marks = Record<number, Mark | string>;

const value = ref([props.modelValue[0], props.modelValue[1]]);
const marks = reactive<Marks>({
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
});
</script>

<style lang="scss">
.el-slider {
	&__bar {
		background-color: #cde7fe;
		height: 10px;
	}

	&__runway {
		height: 10px;
	}

	&__button {
		border: solid 0px;
		background-color: #3db4f2;
		border-radius: 6px;
		height: 16px;
		width: 16px;
		margin-top: 4px;

		&:hover {
			transform: scale(1);
		}
	}

	&__stop {
		background-color: #fafafa;
		top: 1px;
		height: 8px;
		width: 8px;
	}

	&__button-wrapper+.el-slider__button-wrapper>.el-slider__button {
		background-color: #3db4f2;
		opacity: 0.7;
	}
}
</style>
