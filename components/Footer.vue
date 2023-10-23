<template>
  <div class="w-full h-[286] px-[30px] py-[50px] mt-[20px] bg-[#11161d] text-[#a0b1c5] text-[15px] leading-relaxed font-semibold">
    <div class="flex flex-col lg:flex-row h-[186px] px-[50px] mx-[90px]">
      <div class="font-bold text-[16px] text-[#3db4f2] flex justify-center lg:justify-start items-center lg:items-start w-full h-full">
        This website is UNOFFICIAL and not related to Anilist.co
      </div>
      <div class="flex justify-center items-start space-x-12">
        <div class="flex flex-col h-full space-y-2">
          <h3 class="text-xl font-bold mb-[16px]">AniTierList</h3>
          <NuxtLink class="hover:text-[#3db4f2]" to="https://github.com/alexisdechiara/AniTierList">Github</NuxtLink>
          <NuxtLink class="hover:text-[#3db4f2]" to="/about">About</NuxtLink>
        </div>
        <div class="flex flex-col h-full space-y-2">
          <h3 class="text-xl font-bold mb-[16px]">AniList</h3>
          <NuxtLink class="hover:text-[#3db4f2]" to="https://anilist.co/">AniList.co</NuxtLink>
          <NuxtLink class="hover:text-[#3db4f2]" to="https://submission-manual.anilist.co/">Add Data</NuxtLink>
          <NuxtLink class="hover:text-[#3db4f2]" to="https://anilist.co/apps">Apps</NuxtLink>
          <NuxtLink class="hover:text-[#3db4f2]" to="https://github.com/AniList/ApiV2-GraphQL-Docs">API</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>