<template>
    <div class="bg-[#edf1f5] flex flex-col w-full min-h-screen h-full justify-start items-center ">
        <div class="bg-aniWhite rounded-aniRounded p-[50px] mt-[60px] flex flex-col max-w-[400px]">
            <h1 class="text-2xl text-center text-[#5f7189] mb-[30px] mt-[20px] font-[Roboto] font-semibold">AniTierList (UNOFFICIAL)</h1>
            <el-input v-model="username" class="mb-[15px] ani-input-username" placeholder="Username" @keyup.enter="enterClicked()">
                <template #prefix>
                    <font-awesome-icon icon="fa-solid fa-search" />
                </template>
            </el-input>
            <el-switch class="w-full flex justify-center" inactive-text="Rank anime" active-text="Rank seasons" v-model="sequelRank" />
            <div class="mt-[15px] px-2">
                <el-checkbox v-model="autoRank" label="Auto rank anime" />
                <AniMultiRangeSlider class="mb-[15px] w-11/12 self-center" v-model="range" />
            </div>
            <el-button type="primary" size="large" @click="enterClicked()" class="ani-button-search" :disabled="username == ''">Search</el-button>
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
            username: '',
            autoRank: false,
            sequelRank: false,
            range: [0, 10]
        }
    },
    methods: {
        enterClicked() {
            const router = useRouter()
            let queries = {}
            if (this.autoRank) queries["auto"] = true;
            if (this.sequelRank) queries["seasons"] = true;
            if (this.range[0] != 0) queries["min"] = this.range[0];
            if (this.range[1] != 10) queries["max"] = this.range[1];
            if (this.username != "") {
                router.push({ path: this.username, query: queries });
            }
        }
    }
}
</script>