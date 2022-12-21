<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
import { ref } from 'vue';
import HMS from '../data/HMS';

const toSubtract = ref(false);
const hoursRef = ref(NaN);
const minutesRef = ref(NaN)
const secondsRef = ref(NaN);
const actions: Action[] = [
    {
        title: 'Update',
        action: () => {
            let signFactor = 1;
            if (toSubtract.value) {
                signFactor = -1;
            }
            const hms = new HMS(
                hoursRef.value * signFactor,
                minutesRef.value * signFactor,
                secondsRef.value * signFactor,
            );
            TimerSystem.updateTime(hms)
        },
        closeModal: true,
        classes: 'btn-primary'
    }
];

</script>
<template>
    <ModalTemplate :actions="actions" modalId="reset-timer-modal" title="Reset Timer?">
        <div class="form-check form-switch">
            <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="atim-switch"
                v-model="toSubtract"
            />
            <label for="atim-switch">Check to Subtract Time</label>
        </div>
        <div class="input-group mb-3">
            <input
                type="number"
                class="form-control"
                id="atim-hours"
                placeholder="Hrs."
                v-model="hoursRef"
            />
            <span class="input-group-text">:</span>
            <input
                type="number"
                class="form-control"
                id="atim-minutes"
                placeholder="Mins."
                v-model="minutesRef"
            />
            <span class="input-group-text">:</span>
            <input
                type="number"
                class="form-control"
                id="atim-seconds"
                placeholder="Secs."
                v-model="secondsRef"
            />
        </div>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>