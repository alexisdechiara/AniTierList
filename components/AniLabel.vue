<template>
  <label :for="linkedTo" :class="{ 'block font-[overpass] text-[#516170] text-capitalize font-semibold text-base text-[15px] leading-[17px] py-[10px]': linkedTo != null }">
    <span v-if="text != null" class="block text-[#516170] text-capitalize font-semibold text-base text-[15px] leading-[17px] py-[10px]">{{ text }}</span>
    <slot name="input"></slot>
  </label>
</template>

<script>
export default {
  name: "AniLabel",
  created() { },
  data() {
    return {};
  },
  props: {
    text: String,
    linkedTo: String
  },
  methods: {},
};
</script>