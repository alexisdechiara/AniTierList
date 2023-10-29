<template>
    <div class="flex items-center w-full font-bold gap-x-2 text-aniGray">
        <slot name="icon"></slot>
        <div class="flex flex-col justify-between grow">
            <span class="text-[10px] font-black leading-normal">{{ title }}</span>
            <span class="text-base leading-none">{{ value }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    value: Number,
});
</script>
