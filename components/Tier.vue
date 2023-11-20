<template>
	<div class="flex min-h-[150px] flex-row">
		<contenteditable v-model="tier.name" tag="div" :contenteditable="isEditable" :no-nl="true" :no-html="true" :style="'background-color:' + tier.color" class="break-word flex min-h-[150px] w-[200px] basis-auto items-center justify-center text-center text-3xl font-bold text-white focus:outline-none" @dblclick="isEditable = true" @focusout="isEditable = false" @returned="enterPressed()" />
		<draggable 
			:list="tier.entries"
			class="flex flex-row flex-wrap w-full"
			item-key="media.id" 
			group="tier"
			animation="150"
			ghost-class="ghost" 
			tag="transition-group" 
			:component-data="{
          tag: 'div',
          type: 'transition-group',
          name: !drag ? 'flip-list' : 'no-move'
        }"
			@start="drag = true" 
			@end="drag = false"
			>
			<template #item="{element, index}">
				<Item :content="element" class="cursor-move" @deleted="removeAt(index)" />
			</template>
		</draggable>
	</div>
</template>

<script setup>
import draggable from "vuedraggable";
import contenteditable from "vue-contenteditable";

	const props = defineProps({
		position: {
			type: Number,
			required: true,
		},
	});

	const tierStore = useTierStore();
	const tier = ref(tierStore.tiers[props.position]);
	const isEditable = ref(false);
	
	function removeAt(index) {
		tier.value.entries.splice(index, 1);
	}
</script>

<style>

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>