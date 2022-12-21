<script setup lang="ts">
import TimerInterface from '../data/TimerInterface';
import Timer from './Timer.vue'
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';

</script>
<template>
   <div
        id="timer-list"
        class="d-flex flex-column align-items-stretch py-4 gap-2 m-auto"
        :style="`width: ${Settings.timerWidth}%`"
    >
        <Timer 
            v-for="[id, timerData] in TimerSystem.map()" 
            :key="id" 
            :timer-id="id"
            :timer-data="timerData"
            :is-active="TimerSystem.activeTimerId() === id"
        />
    </div> 
</template>
<script lang="ts">export default {};</script>