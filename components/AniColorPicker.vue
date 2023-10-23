<template>
	<div class="relative grow">
		<el-button class="flex items-center justify-center cursor-pointer w-[40px] aspect-1 bg-aniBody focus:outline-0 rounded-[6px] focus:shadow-aniShadowButton" size="large" color="#fafafa" @click="showColorPicker = !showColorPicker">
			<font-awesome-icon icon="fas fa-swatchbook" class="w-[18px] h-[18px]" :style="{ 'color': color }" />
		</el-button>
		<div v-show="showColorPicker" class="fixed inset-0 z-0" @click="showColorPicker = !showColorPicker" />
		<div v-show="showColorPicker" class="absolute left-[50px] top-0 z-20">
			<!-- <ColorPicker class="box-content" v-show="showColorPicker" theme="light" :color="color" :colors-default="colorsDefault" sucker-hide @changeColor="changeColor" /> -->
		</div>
	</div>
</template>

<script>
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'


export default {
	components: {
		ColorPicker,
	},
	data() {
		return {
			color: this.modelValue,
			showColorPicker: false,
			colorsDefault: ['#57b1ef', '#c063ff', '#4cca51', '#ef881a', '#e13333', '#fc9dd6', "#677b94"]
		}
	},
	props: {
		modelValue: String
	},
	methods: {
		changeColor(color) {
			this.color = color.hex;
			this.$emit('update:modelValue', this.color)
		},
	},
}
</script>