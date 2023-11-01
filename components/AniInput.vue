<template>
	<AniLabel :text="label">
		<template #input>
			<el-input v-model="value" class="max-w-[170px]" :disabled="disabled" :clearable="clearable" @change="value" @keyup.enter="updateValue">
				<template v-if="search" #prefix>
					<font-awesome-icon icon="fa-solid fa-search" />
				</template>
			</el-input>
		</template>
	</AniLabel>
</template>

<script>
import { ElInput } from "element-plus";
export default {
	name: "AniInput",
	components: {
		ElInput,
	},
	props: {
		label: String,
		modelValue: String,
		disabled: Boolean,
		search: Boolean,
		clearable: Boolean,
	},
	data() {
		return {
			value: this.modelValue,
		};
	},
	methods: {
		updateValue() {
			emit("update:modelValue", this.value);
		},
	},
};
</script>
