<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
const actions: Action[] = [
    {
        title: 'Delete',
        action: () => {
            TimerSystem.deleteTimer()
        },
        closeModal: true,
        classes: 'btn-danger'
    }
];

</script>
<template>
    <ModalTemplate :actions="actions" :modalId="'delete-timer-modal'" :title="'Delete Timer?'">
        <div class="modal-body">
            <label class="form-label"
                >Are you sure you want to delete this timer?</label
            >
        </div>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>