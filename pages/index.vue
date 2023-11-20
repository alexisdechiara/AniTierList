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
				<AniMultiRangeSlider v-model="range" class="mb-[15px] w-11/12 self-center" />
			</div>
			<el-button type="primary" size="large" class="ani-button-search" :disabled="username == ''" @click="enterClicked()">Search</el-button>
			<template v-if="userStore.getUsername">
				<el-divider>OR CONTINUE</el-divider>
				<div class="flex w-full h-16 gap-x-6 border rounded-aniRounded overflow-hidden items-center p-0 hover:shadow-md transition-shadow cursor-pointer" @click="continueClicked()">
					<NuxtImg :src="userStore.getUser.avatar.medium" fit="cover" class="h-16 aspect-square" />
					<div class="w-full flex flex-col">
						<span class="font-bold text-aniGray">{{ userStore.getUsername }}</span>
						<span v-if="tierStore.getAllEntries.length" class="font-normal text-aniGray">{{tierStore.getAllEntries.length}} entries</span>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">

// Data
const autoRank = ref<boolean>(false);
const range = ref<number[]>([0, 10]);
const username = ref<string>('');
const sequelRank = ref<boolean>(false);

// Store
const userStore = useUserStore();
const tierStore = useTierStore();

// Methods
function enterClicked() {
	const queries: any = {};
	if (autoRank.value) queries["auto"] = true;
	if (!sequelRank.value) queries["franchise"] = true;
	if (range.value[0] != 0 && range.value[0] <= 10) queries["min"] = range.value[0];
	if (range.value[1] != 10 && range.value[1] >= 0) queries["max"] = range.value[1]; 
	if (username.value != "") navigateTo({ path: username.value, query: queries });
}

function continueClicked() {
	navigateTo(userStore.getUsername)
}
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