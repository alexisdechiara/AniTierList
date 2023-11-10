<template>
	<AniLabel :text="label">
		<template #input>
			<el-input v-model="value" class="max-w-[170px]" :disabled="disabled" :clearable="clearable" @input="updateValue">
				<template v-if="search" #prefix>
					<font-awesome-icon icon="fa-solid fa-search" />
				</template>
			</el-input>
		</template>
	</AniLabel>
</template>

<script setup lang="ts">

const props = defineProps({
  label: {
		type: String,
		required: true,
	},
  modelValue: {
		type: String,
		required: true,
	},
  disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
  search: {
		type: Boolean,
		required: false,
		default: false,
	},
  clearable: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emits = defineEmits(["update:modelValue"]);

const value = ref(props.modelValue);

function updateValue() {
  emits('update:modelValue', value.value);
};

watch(() => props.modelValue, (newValue) => {
  value.value = newValue;
});

</script>