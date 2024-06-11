<script setup lang="ts">
import TimerItem from './TimerItem.vue';
import MobileTimerItem from './MobileTimerItem.vue';
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';
import { Sortable } from 'sortablejs-vue3';
import SortableJS from 'sortablejs';
import { computed } from 'vue';
import mobile from 'is-mobile';

const dragOptions = {
	animation: 150,
	handle: '.handle'
};
const timerList = TimerSystem.getTimerList();

const mutateList = (event: SortableJS.SortableEvent) => {
	const { oldIndex, newIndex } = event;
	if (oldIndex === undefined || newIndex === undefined) return;
	const item = timerList.splice(oldIndex, 1)[0];
	timerList.splice(newIndex, 0, item);
};

const TimerComponent = computed(() => {
	return mobile() ? MobileTimerItem : TimerItem;
});

</script>
<template>
	<Sortable
		id="timer-list"
		:list="timerList"
		item-key="id"
		:options="dragOptions"
		class="container mt-5 d-flex flex-column gap-2 p-0"
		@end="mutateList"
	>
		<template #item="{ element }">
			<Transition
				appear
				name="timer-wrapper"
			>
				<TimerComponent
					v-if="TimerSystem.isFiltered(element.id)"
					:key="element.id"
					:timer-id="element.id"
					:timer-data="element.timer"
					:is-active="TimerSystem.timerIsActive(element.id)"
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