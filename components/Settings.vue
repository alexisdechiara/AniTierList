<template>
  <button :class="buttonClass" @click="openDialog"><font-awesome-icon :icon="icon"/>Settings</button>
  
  <el-dialog v-model="isOpen" title="Settings">
		<AniLoader v-if="isLoading" />
		<template v-else>
			<el-form label-position="top">
				<el-form-item label="Language" class="font-medium">
					<el-select v-model="localLanguage" fit-input-width class="w-full ani-select-template">
						<el-option label="Romaji (Shingeki no Kyojin)" value="ROMAJI" />
						<el-option label="English (Attack on Titan)" value="ENGLISH" />
						<el-option label="Native (進撃の巨人)" value="NATIVE" />
					</el-select>
				</el-form-item>
				<el-form-item label="Scoring System" class="font-semibold">
					<el-select v-model="localScoreFormat" fit-input-width class="w-full ani-select-template">
						<el-option label="100 point (55/100)" value="POINT_100" />
						<el-option label="10 Point Decimal (5,5/10)" value="POINT_10_DECIMAL" />
						<el-option label="10 Point (5/10)" value="POINT_10" />
						<el-option label="5 Star (3/5)" value="POINT_5" />
						<el-option label="3 Point Smiley :)" value="POINT_3" />
					</el-select>
				</el-form-item>
				<el-form-item label="Default List Order">
					<el-select v-model="localRowOrder" fit-input-width class="w-full ani-select-template">
						<el-option label="Score" value="Score" />
						<el-option label="Title" value="Title" />
						<el-option label="Last Updated" value="Last Updated" />
						<el-option label="Last Added" value="Last Added" />
					</el-select>
				</el-form-item>
			</el-form>
			<el-form label-position="right" class="flex gap-x-4">
				<el-form-item label="Display adult content">
					<el-switch v-model="localDisplayAdultContent" />
				</el-form-item>
				<el-form-item label="Transition for tiles">
					<el-switch v-model="localDisplayTransition" />
				</el-form-item>
			</el-form>
		</template>
		<div class="flex w-full">
			<el-button type="primary" class="w-full" @click="onSubmit">Validate</el-button>
			<el-button type="danger" plain @click="onCancel">Cancel</el-button>
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
defineProps({
  buttonClass: {
    type: String,
    required: false,
    default: "",
  },
  icon: {
    type: String,
    required: false,
    default: "",
  },
});

const userStore = useUserStore();
const tierStore = useTierStore();

const isOpen = ref(false);
const localLanguage = ref();
const localScoreFormat = ref();
const localRowOrder = ref("");
const localDisplayAdultContent = ref(false);
const localDisplayTransition = ref(false);
const isLoading = ref(false);

function openDialog() {
	isOpen.value = true;
	localLanguage.value = userStore.titleLanguage;
	localScoreFormat.value = userStore.scoreFormat;
	localRowOrder.value = userStore.rowOrder;
	localDisplayAdultContent.value = userStore.displayAdultContent;
	localDisplayTransition.value = userStore.displayTransition;
}

function onCancel() {
	isOpen.value = false;
}

function onSubmit() {
	isLoading.value = true;
	userStore.titleLanguage = localLanguage.value;
	userStore.displayAdultContent = localDisplayAdultContent.value;
	userStore.displayTransition = localDisplayTransition.value;
	console.log("sort Unranked Tier Entries");

	if(userStore.rowOrder != localRowOrder.value) {
		userStore.rowOrder = localRowOrder.value;
		tierStore.sortUnrankedTierEntries();
	}

	if (userStore.scoreFormat != localScoreFormat.value) {
		tierStore.changeEntriesScoreRange(useScoreRange(userStore.scoreFormat).value, useScoreRange(localScoreFormat.value).value);
		userStore.scoreFormat = localScoreFormat.value;
	}

	isLoading.value = false;
	isOpen.value = false;
}

// function getScoreRange(scoreFormat: string): number[] {
// 	switch(scoreFormat) {
// 		case "POINT_100":
// 			return [0, 100];
// 		case "POINT_10_DECIMAL":
// 			return [0, 10];
// 		case "POINT_10":
// 			return [0, 10];
// 		case "POINT_5":
// 			return [0, 5];
// 		case "POINT_3":
// 			return [0, 3];
// 		default:
// 			return [0, 100];
// 	}
// }

</script>

<style scoped>

</style>

