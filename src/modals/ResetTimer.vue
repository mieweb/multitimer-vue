<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
const actions: Action[] = [
    {
        title: 'Reset',
        action: () => {
            TimerSystem.resetTimer()
        },
        closeModal: true,
        classes: 'btn-primary'
    }
];

</script>
<template>
    <ModalTemplate :actions="actions" modalId="reset-timer-modal" title="Reset Timer?">
        <label class="form-label"
            >Are you sure you want to reset this timer?</label
        >
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>