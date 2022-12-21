<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import TimerInterface from '../data/TimerInterface';

const addTimer = (timer: TimerInterface) => {
    TimerSystem.addTimer(timer);
};
const deleteFavorite = (id: number) => {
    TimerSystem.timerToConfirm = id;
    TimerSystem.deleteFavorite()
};
</script>
<template>
    <ModalTemplate :modalId="'quick-timer-modal'" :title="'Quick Timers'">
        <ul id="common-tickets-list">
            <li>34603 Cleanup call</li>
            <li>34511 Hotfix review</li>
            <li>35270 Senior dev</li>
            <li>36587 Zeus-web downtime</li>
            <li>36209 Company-wide meeting</li>
            <li>49022 EH Master Build Call</li>
            <li>80204 Encounter UI</li>
            <li>95143 Dev PTO 2021</li>
        </ul>
        <hr>
        <h5>Custom Timers</h5>
        <div id="custom-tickets-list">
            <div v-for="[id, timer] in TimerSystem.favorites()"
                :key="id"
            >
                <button class="plain-btn" @click="addTimer(timer.value)">{{timer.issue}} {{timer.title}}</button>
                <button class="plain-btn" @click="deleteFavorite(id)"><i class="fa fa-trash-alt"></i></button>
            </div>
        </div>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>