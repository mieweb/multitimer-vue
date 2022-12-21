<script setup lang="ts">
import { TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import ResetAllTimers from '../modals/ResetAllTimers.vue';
import DeleteAllTimers from '../modals/DeleteAllTimers.vue';
import { parse } from 'date-fns';

const updateLogDate = (event: Event) => {
    const dateString = (event.target as HTMLInputElement).value;
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    TimerSystem.setLogDate(date);
};

</script>
<template>
<div class="d-flex justify-content-center pt-4">
    <div class="btn-group" role="group">
        <div class="input-group">
            <input @change="updateLogDate" class="form-control" type="date" id="log-date" :valueAsDate="new Date()">
            <button
                id="save-timers-button"
                class="btn btn-outline-primary"
                @click="() => TimerSystem.logAllTimers()"
            >
                Log All Timers
            </button>
            <button
                class="btn btn-outline-danger"
                @click=openModal(ResetAllTimers)
            >
                Reset All Timers
            </button>
            <button
                class="btn btn-outline-danger"
                @click="openModal(DeleteAllTimers)"
            >
                Delete All Timers
            </button>
        </div>
    </div>
</div>
</template>
<script lang="ts">export default {};</script>