<template>
	<div class="flex h-full min-h-screen w-full flex-col items-center justify-start bg-[#edf1f5]">
		<div class="mt-[60px] flex max-w-[400px] flex-col rounded-aniRounded bg-aniWhite p-[50px]">
			<h1 class="mb-[30px] mt-[20px] text-center font-[Roboto] text-2xl font-semibold text-[#5f7189]">AniTierList (UNOFFICIAL)</h1>
			<el-input v-model="username" class="ani-input-username mb-[15px]" placeholder="Username" @keyup.enter="enterClicked()">
				<template #prefix>
					<font-awesome-icon icon="fa-solid fa-search" />
				</template>
			</el-input>
			<el-switch v-model="sequelRank" class="flex justify-center w-full" inactive-text="Rank anime" active-text="Rank seasons" />
			<div class="mt-[15px] px-2">
				<el-checkbox v-model="autoRank" label="Auto rank anime" />
				<el-select v-model="scoreFormat" fit-input-width class="w-full ani-select-template">
						<el-option label="User default score" value="DEFAULT" />
						<el-option label="100 point (55/100)" value="POINT_100" />
						<el-option label="10 Point Decimal (5,5/10)" value="POINT_10_DECIMAL" />
						<el-option label="10 Point (5/10)" value="POINT_10" />
						<el-option label="5 Star (3/5)" value="POINT_5" />
						<el-option label="3 Point Smiley :)" value="POINT_3" />
					</el-select>
				<AniMultiRangeSlider v-model="range" :disabled="scoreFormat == 'DEFAULT'" class="mb-[15px] w-11/12 self-center" :min="getScoreRange[0]" :max="getScoreRange[1]" :step="getScoreRange[2]" />
			</div>
			<el-button type="primary" size="large" class="ani-button-search" :disabled="username == ''" @click="enterClicked()">Search</el-button>
			<template v-if="userStore.getUsername">
				<el-divider>OR CONTINUE</el-divider>
				<div class="flex items-center w-full h-16 p-0 overflow-hidden transition-shadow border cursor-pointer gap-x-6 rounded-aniRounded hover:shadow-md" @click="continueClicked()">
					<NuxtImg :src="userStore.getUser.avatar.medium" fit="cover" class="h-16 aspect-square" />
					<div class="flex flex-col w-full">
						<span class="font-bold text-aniGray">{{ userStore.getUsername }}</span>
						<span v-if="tierStore.getAllEntries.length" class="font-normal text-aniGray">{{ tierStore.getAllEntries.length }} entries</span>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
// Data
const autoRank = ref<boolean>(false);
const range = ref<number[]>([0, 100]);
const username = ref<string>("");
const sequelRank = ref<boolean>(false);
const scoreFormat = ref<string>("DEFAULT");

// Store
const userStore = useUserStore();
const tierStore = useTierStore();

// Methods
function enterClicked() {
	const queries: any = {};
	if (autoRank.value) queries["auto"] = true;
	if (!sequelRank.value) queries["franchise"] = true;
	if (range.value[0] != 0 && range.value[0] <= getScoreRange.value[1]) queries["min"] = range.value[0];
	if (range.value[1] != getScoreRange.value[1] && range.value[1] >= 0) queries["max"] = range.value[1];
	if(scoreFormat.value != "DEFAULT") queries["scoring"] = scoreFormat.value;
	if (username.value != "") navigateTo({ path: username.value, query: queries });
}

function continueClicked() {
	navigateTo(userStore.getUsername);
}

const getScoreRange = computed((): number[] => {
	switch (scoreFormat.value) {
		case "POINT_100":
			return [0, 100, 1];
		case "POINT_10_DECIMAL":
			return [0, 10, 0.1];
		case "POINT_10":
			return [0, 10, 1];
		case "POINT_5":
			return [0, 5, 1];
		case "POINT_3":
			return [0, 3, 1];
		default:
			return [0, 100, 1];
	}
});
</script>

<style>
.el-divider {
	margin-top: 2em;
	margin-bottom: 2em;
}
.el-divider__text {
	background-color: #fafafa;
	font-size: 0.75em;
	font-weight: 600;
}
</style>
