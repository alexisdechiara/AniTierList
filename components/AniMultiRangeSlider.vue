<template>
	<el-slider v-model="value" class="w-full" :disabled="disabled" range :marks="marks" :min="min" :step="step" show-stops :max="max" @input="updateValue()" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { CSSProperties } from "vue";

interface Mark {
	style: CSSProperties;
	label: string;
}

const props = defineProps({
	modelValue: {
		type: Array<number>,
		default: [0, 100],
	},
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
	step: {
		type: Number,
		default: 1,
	},
	disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function updateValue() {
	emit("update:modelValue", [value.value[0], value.value[1]]);
}

type Marks = Record<number, Mark | string>;

const value = ref([props.modelValue[0], props.modelValue[1]]);

const marks = ref<Marks>(
	createMarks(),
);

//when max update change marks
watch(() => props.max, () => {
	marks.value = createMarks();
});

function createMarks(): Marks {
	if (props.max <= 3) {
		return {
			0: 'No score',
			1: ':(',
			2: ':|',
			3: ':)',
		} as Marks;
	}
	else if (props.max <= 10) {
		const res: Marks = {};
		Array.from(Array(props.max+1).keys()).forEach(element => {
			res[element] = element.toString();
		});
		return res;
	} else {
		return {
			0: '0',
			10: '10',
			20: '20',
			30: '30',
			40: '40',
			50: '50',
			60: '60',
			70: '70',
			80: '80',
			90: '90',
			100: '100',
		} as Marks;
	}
}

</script>

<style>
.el-slider__bar {
	background-color: #cde7fe;
	height: 10px;
}
.el-slider__runway {
	height: 10px;
}
.el-slider__button {
	border: solid 0px;
	background-color: #3db4f2;
	border-radius: 6px;
	height: 16px;
	width: 16px;
	margin-top: 4px;
}
.el-slider__button:hover {
	transform: scale(1);
}
.el-slider__stop {
	background-color: #fafafa;
	top: 1px;
	height: 8px;
	width: 8px;
}
.el-slider__button-wrapper + .el-slider__button-wrapper > .el-slider__button {
	background-color: #3db4f2;
	opacity: 0.7;
}
</style>
