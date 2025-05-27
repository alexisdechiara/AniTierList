<template>
	<div class="flex min-h-[150px] flex-row">
		<contenteditable v-model="tier.name" tag="div" :contenteditable="isEditable" :no-nl="true" :no-html="true" :style="'background-color:' + tier.color" class="break-word flex min-h-[150px] w-[200px] basis-auto items-center justify-center text-center text-3xl font-bold text-white focus:outline-none" @dblclick="isEditable = true" @focusout="isEditable = false" @returned="enterPressed()" />
		<draggable
			:list="tier.entries"
			class="flex w-full flex-row flex-wrap"
			item-key="media.id"
			group="tier"
			:animation="userStore.displayTransition ? '150' : '0'"
			ghost-class="ghost"
			tag="transition-group"
			:component-data="{
				tag: 'div',
				type: 'transition-group',
				name: !drag && userStore.displayTransition ? 'flip-list' : 'no-move',
			}"
			@start="drag = true"
			@end="drag = false"
			:move="checkMove"
		>
			<template #item="{ element, index }">
				<Item :content="element" class="cursor-move" @deleted="removeAt(index)" />
			</template>
		</draggable>
	</div>
</template>

<script setup>
import draggable from "vuedraggable"
import contenteditable from "vue-contenteditable"

const props = defineProps({
	position: {
		type: Number,
		required: true,
	},
})

const userStore = useUserStore()
const tierStore = useTierStore()
const tier = ref(tierStore.tiers[props.position])
const isEditable = ref(false)

function removeAt(index) {
	tier.value.entries.splice(index, 1)
}

function checkMove(evt) {
  const draggedItemData = evt.draggedContext.element;
  if (!draggedItemData || !draggedItemData.media || typeof draggedItemData.media.id === 'undefined') {
    console.warn('Dragged item data or media.id is missing from dragged item. Allowing move by default.');
    return true; 
  }
  const draggedMediaId = draggedItemData.media.id;

  // Allow reordering within the same list.
  if (evt.from === evt.to) {
    return true;
  }

  // Check if an item with the same ID (but not the same object instance) exists anywhere else.
  // tierStore.getAllEntries will include the draggedItemData itself from its source list.
  const allOtherEntries = tierStore.getAllEntries.filter(entry => entry !== draggedItemData); 
  
  if (allOtherEntries.some(entry => entry.media.id === draggedMediaId)) {
     console.warn(`DUPLICATE CHECK (Tier.vue): Item ID ${draggedMediaId} already exists elsewhere in the tier lists. Preventing drop into a new list.`);
     // Optional: pageStore.setNotification({ message: 'This item already exists in another tier or unranked list.', type: 'warning' });
     return false; // Prevent drop
  }
  return true; // Allow move
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
