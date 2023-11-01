<template>
	<div class="flex h-full min-h-screen w-full flex-col items-center justify-start bg-[#edf1f5]">
		<div class="mt-[60px] flex max-w-[400px] flex-col rounded-aniRounded bg-aniWhite p-[50px]">
			<h1 class="mb-[30px] mt-[20px] text-center font-[Roboto] text-2xl font-semibold text-[#5f7189]">AniTierList (UNOFFICIAL)</h1>
			<el-input v-model="username" class="ani-input-username mb-[15px]" placeholder="Username" @keyup.enter="enterClicked()">
				<template #prefix>
					<font-awesome-icon icon="fa-solid fa-search" />
				</template>
			</el-input>
			<el-switch v-model="sequelRank" class="flex w-full justify-center" inactive-text="Rank anime" active-text="Rank seasons" />
			<div class="mt-[15px] px-2">
				<el-checkbox v-model="autoRank" label="Auto rank anime" />
				<AniMultiRangeSlider v-model="range" class="mb-[15px] w-11/12 self-center" />
			</div>
			<el-button type="primary" size="large" class="ani-button-search" :disabled="username == ''" @click="enterClicked()">Search</el-button>
		</div>
	</div>
</template>
<script>
import { ElButton, ElInput, ElSwitch, ElCheckbox, ElSlider } from "element-plus";

export default {
	name: "Homepage",
	components: {
		ElButton,
		ElInput,
		ElSwitch,
		ElCheckbox,
		ElSlider,
	},
	data() {
		return {
			username: "",
			autoRank: false,
			sequelRank: false,
			range: [0, 10],
		};
	},
	methods: {
		enterClicked() {
			const router = useRouter();
			const queries = {};
			if (this.autoRank) queries["auto"] = true;
			if (this.sequelRank) queries["seasons"] = true;
			if (this.range[0] != 0) queries["min"] = this.range[0];
			if (this.range[1] != 10) queries["max"] = this.range[1];
			if (this.username != "") {
				router.push({ path: this.username, query: queries });
			}
		},
	},
};
</script>
