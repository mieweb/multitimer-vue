<script setup lang="ts">
import TimerItem from './TimerItem.vue';
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';
import { Sortable } from 'sortablejs-vue3';
import SortableJS from 'sortablejs';

const dragOptions = {
	animation: 150,
	handle: '.handle'
};
const timerList = TimerSystem.getTimerList();

const mutateList = (event: SortableJS.SortableEvent) => {
	console.log(timerList[0].timer.title);
	const { oldIndex, newIndex } = event;
	if (oldIndex === undefined || newIndex === undefined) return;
	const item = timerList.splice(oldIndex, 1)[0];
	timerList.splice(newIndex, 0, item);
	console.log(timerList[0].timer.title);
};

</script>
<template>
	<!-- <TransitionGroup
		id="timer-list"
		tag="div"
		name="timer-list"
		class="d-flex flex-column align-items-stretch py-4 gap-2 m-auto"
		:style="`width: ${Settings.timerWidth}%`"
	>
		<TimerItem 
			v-for="[id, timerData] in TimerSystem.iterator()" 
			:key="id" 
			:timer-id="id"
			:timer-data="timerData"
			:is-active="TimerSystem.activeTimerId() === id"
		/>
	</TransitionGroup>  -->
	<Sortable
		:list="timerList"
		item-key="id"
		:options="dragOptions"
		class="d-flex flex-column align-items-stretch py-4 gap-2 m-auto"
		:style="`width: ${Settings.timerWidth}%`"
		@end="mutateList"
	>
		<template #item="{ element }">
			<Transition
				appear
				name="timer-wrapper"
			>
				<TimerItem
					v-if="TimerSystem.isFiltered(element.id)"
					:key="element.id"
					:timer-id="element.id"
					:timer-data="element.timer"
					:is-active="TimerSystem.activeTimerId() === element.id"
				/>
			</Transition>
		</template>
	</Sortable>
</template>
<script lang="ts">export default {};</script>
<style scoped>
    .timer-list-enter-active,
    .timer-list-leave-active {
        transition: all 0.3s ease;
    }


    .timer-list-leave-to,
    .timer-list-enter-from {
        opacity: 0;
        transform: translateY(30px);
    }

    .timer-wrapper-enter-active,
    .timer-wrapper-leave-active {
        transition: all 0.3s ease;
    }


    .timer-wrapper-leave-to,
    .timer-wrapper-enter-from {
        opacity: 0;
        transform: translateY(30px);
    }
</style>