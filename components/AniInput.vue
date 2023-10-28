<template>
  <AniLabel :text="label">
    <template #input>
      <el-input class="max-w-[170px]" v-model="value" @change="value" @keyup.enter="updateValue" :disabled="disabled" :clearable="clearable">
        <template v-if="search" #prefix>
          <font-awesome-icon icon="fa-solid fa-search" />
        </template>
      </el-input>
    </template>
  </AniLabel>
</template>

<script>
import { ElInput } from 'element-plus'
export default {
  name: "AniInput",
  components: {
    ElInput
  },
  data() {
    return {
      value: this.modelValue
    };
  },
  props: {
    label: String,
    modelValue: String,
    disabled: Boolean,
    search: Boolean,
    clearable: Boolean
  },
  methods: {
    updateValue() {
      emit('update:modelValue', this.value);
    }
  },
};
</script>