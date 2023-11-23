<template>
	<el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="changeColor" />
</template>

<script lang="ts" setup>
const props = defineProps({
	modelValue: {
		type: String,
		required: true,
	},
});

const color = ref(props.modelValue);
const predefineColors = ref(["#57b1ef", "#c063ff", "#4cca51", "#ef881a", "#e13333", "#fc9dd6", "#677b94"]);

watch(
	() => props.modelValue,
	(newVal) => {
		color.value = newVal;
	},
);

//emits
const emit = defineEmits(["update:modelValue"]);

//methods
const changeColor = () => {
	emit("update:modelValue", color);
};
</script>
