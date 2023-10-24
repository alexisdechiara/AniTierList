<template>
  <AniLabel :text="label">
    <template #input>
      <el-select v-model="value" placement="bottom" fit-input-width @change="updateValue()" :suffix-icon="ElIconArrowDownBold" :clear-icon="ElIconCloseBold" :multiple="multiple" :disabled="disabled" :collapse-tags="multiple" class="min-w-[150px] max-w-[170px]" clearable placeholder="Any">
        <el-option class="capitalize" v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </template>
  </AniLabel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Option {
  value: string,
  label: string
}

const props = defineProps({
  label: String,
  white: Boolean,
  modelValue: Array<Option>,
  options: Array<Option>,
  multiple: Boolean,
  disabled: Boolean
});

let value = ref<Array<Option>>([]);

const emit = defineEmits(['update:modelValue'])

function updateValue() {
  emit('update:modelValue', this.value);
}
</script>