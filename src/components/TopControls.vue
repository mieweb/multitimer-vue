<script setup lang="ts">
import { TimerFilter, TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import ResetAllTimers from '../modals/ResetAllTimers.vue';
import DeleteAllTimers from '../modals/DeleteAllTimers.vue';
import { parse } from 'date-fns';
import { reactive } from 'vue';

const updateLogDate = (event: Event) => {
    const dateString = (event.target as HTMLInputElement).value;
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    TimerSystem.setLogDate(date);
};

const filter: TimerFilter = {
    search: '',
    withTime: false
};

const updateFilter = () => TimerSystem.updateFilter(filter);
</script>
<template>
<div class="d-flex flex-column justify-content-center align-items-center">
    <div class="d-flex justify-content-center pt-4 mb-3">
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
    <div class="d-flex-justify-content-center">
        <div class="input-group">
            <div class="input-group-text">
                Search timers:
            </div>
            <input class="form-control" type="text" @input="updateFilter" v-model="filter.search"/>
            <div class="input-group-text">
                <input class="form-check-input" name="has-time-check" type="checkbox" @change="updateFilter" v-model="filter.withTime"/>
                <label class="form-check-label" for="has-time-check">&nbsp;Timers with time</label>
            </div>
        </div>
    </div>
</div>
</template>
<script lang="ts">export default {};</script>