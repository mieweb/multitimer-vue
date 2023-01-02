<script setup lang="ts">
import TimerItem from './TimerItem.vue';
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';
</script>
<template>
	<TransitionGroup
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
	</TransitionGroup> 
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
</style>