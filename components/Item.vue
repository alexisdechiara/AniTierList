<template>
  <div class="relative group">
    <NuxtImg loading="lazy" class="z-0 flex object-cover h-full p-0 aspect-w-2 aspect-h-3" :src="content.media.coverImage.medium" width="100" height="150" alt="" />
    <font-awesome-icon ref="reference" @click.stop="showDetail = !showDetail" class="absolute invisible p-1 rounded-full cursor-pointer group-hover:visible z-5 text-aniWhite bottom-2 right-2 hover:bg-aniWhite hover:text-aniGray" icon="fa-solid fa-ellipsis-h" />

    <div v-if="showDetail" ref="floating" v-on-click-outside.buble="hideModal" :style="floatingStyles" class="z-50 flex justify-between overflow-hidden rounded-[3px] h-[265px] w-[460px] bg-aniWhite">
      <NuxtLink :to="this.content.media.siteUrl" class="relative w-[185px] h-full z-40">
        <NuxtImg :src="content.media.coverImage.extraLarge" alt="" width="185" class="relative object-cover h-full cursor-pointer" />
      </NuxtLink>
      <div class="flex flex-col w-[275px] h-full bg-aniWhite">
        <!-- scrollbar style bg-[#292929]/[0.44] hover:bg-[#292929]/[0.88] -->
        <el-scrollbar class="flex flex-col h-full p-4 grow">
          <div class="flex justify-between">
            <div class="flex flex-col gap-y-1">
              <span class="text-xs font-semibold text-[#6E859E]">{{ content.media.format }}</span>
              <span class="font-[Overpass] font-semibold text-lg leading-none text-aniGray">{{ content.media.title.userPreferred }}</span>
              <div class="leading-3 mb-2">
                <template v-for="studio in content.media.studios.edges" :key="studio.name">
                  <NuxtLink v-if="studio.isMain" :to="studio.node.siteUrl" class="inline text-xs font-semibold text-[#6E859E]/75 hover:text-aniPrimary">
                    {{ studio.node.name }} &nbsp;
                  </NuxtLink>
                </template>
              </div>
            </div>
            <div class="flex flex-col gap-y-2">
              <div class="font-bold text-aniGray text-base flex gap-x-2">
                <font-awesome-icon icon="fas fa-star" class="text-[rgb(247,191,99)] text-lg" />
                #{{ content.media.rankings[0].rank }}
              </div>
              <div class="flex gap-x-2 font-bold text-aniGray">
                <font-awesome-icon icon="far fa-smile" v-if="content.score >= 8" class="text-aniGreen text-lg" />
                <font-awesome-icon icon="far fa-meh" v-if="content.score < 8 >= 6" class="text-aniOrange" />
                <font-awesome-icon icon="far fa-frown" v-if="content.score < 6" class="text-aniRed" />
                {{ content.score }}
              </div>
            </div>
          </div>
          <p class="text-[11px] leading-4 text-[#6E859E] font-medium" v-html="content.media.description"></p>
        </el-scrollbar>
        <div class="grid grid-cols-3 w-full items-center bg-[#EFF7FB] px-4 h-[44px]">
          <div class="flex flex-wrap items-center h-5 col-span-2 overflow-hidden grow gap-x-2">
            <span v-for="genre in content.media.genres" class="flex items-center h-full px-3 text-xs font-bold leading-5 text-center align-middle rounded-full bg-aniPrimary text-aniWhite" :key="genre">{{ genre }}</span>
          </div>
          <div class="flex justify-end col-span-1">
            <button class="flex justify-center items-center bg-[#E85D75] h-5 w-5 rounded-full cursor-pointer">
              <font-awesome-icon @click="$emit('deleted'); hideModal()" icon="fas fa-trash" class="text-aniWhite text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useFloating, offset, shift, autoPlacement } from '@floating-ui/vue';
import type { NuxtImg } from 'nuxt/dist/app/components/nuxt-stubs';
// @ts-ignore
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
  content: Object,
}>()

let showDetail = ref(false)

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
  middleware: [
    autoPlacement(),
    offset({
      mainAxis: 16,
    }),
    shift()],
});

const hideModal = () => {
  setTimeout(() => {
    showDetail.value = false,
      1
  })
}

</script>


