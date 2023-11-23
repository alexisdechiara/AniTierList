<template>
	<NuxtLink :to="url" target="_blank" :style="{ 'background-color': color || '#515381' }" class="relative h-6 w-6 cursor-pointer overflow-hidden rounded-[3px] fill-aniWhite">
		<Icon :name="getSiteIcon()" :class="{ 'p-1': padding }" class="flex h-full w-full justify-center text-aniWhite" />
	</NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
	site: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		default: null,
	},
});

const padding = ref(true);

const getSiteIcon = () => {
	if (props.site) {
		switch (props.site.toLowerCase()) {
			case "official site":
				return "fa6-regular:compass";
			case "twitter" || "x":
				return "bi:twitter-x";
			case "facebook":
				return "cib:facebook";
			case "instagram":
				return "cib:instagram";
			case "tiktok":
				return "cib:tiktok";
			case "youtube":
				return "cib:youtube";
			case "crunchyroll":
				return "cib:crunchyroll";
			case "hulu":
				return "cib:hulu";
			case "netflix":
				return "cib:netflix";
			case "bilibili tv":
				return "fa6-brands:bilibili";
			case "adult swim":
				return "arcticons:adultswim";
			case "funimation":
				return "FunimationIcon";
			case "wakanim":
				return "WakanimIcon";
			case "hidive":
				return "HidiveIcon";
			case "iq":
				return removePadding("IqiyiIcon");
			case "disney plus":
				return removePadding("DisneyPlusIcon");
			case "amazon prime video":
				return removePadding("PrimeVideoIcon");
			case "hbo max":
				return removePadding("HboMaxIcon");
			case "max":
				return removePadding("MaxIcon");
			case "tubi tv":
				return removePadding("TubiTvIcon");
			default:
				return "fa6-solid:arrow-up-right-from-square";
		}
	}
	return "";
};

const removePadding = (value: String) => {
	padding.value = false;
	return value;
};
</script>
