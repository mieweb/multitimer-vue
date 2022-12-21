<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import HMS from '../data/HMS';
import TimerInterface from '../data/TimerInterface';
import { Ref, ref } from 'vue';
import { TimerSystem } from '../data/TimerSystem';

defineProps<{
    actions?: Action[]
}>();
const emit = defineEmits(['addTimer', 'splitTimer']);

const formData = {
    issue: '',
    title: '',
    time: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    billStatus: '',
    comment: '',
    link: ''
};

const formElement = ref<HTMLFormElement>();

const clearFormData = () => {
    formData.issue = '';
    formData.title = '';
    formData.time.hours = 0;
    formData.time.minutes = 0;
    formData.time.seconds = 0;
    formData.billStatus = '';
    formData.comment = '';
    formData.link = '';
};

const actions = [
    {
        title: 'Split Timer',
        action: () => {
            emit('splitTimer');
        },
    },
    {
        title: 'Add Timer',
        action: () => {
            const ti: TimerInterface = {
                title: formData.title,
                issue: formData.issue,
                link: formData.link,
                comment: formData.comment,
                billStatus: formData.billStatus,
                time: new HMS(),
                controlsHidden: true
            };
            // @ts-ignore
            formElement.value.reset();
            clearFormData();
            TimerSystem.addTimer(ti);
        },
        classes: 'btn-primary'
    }
];
</script>

<template>
    <ModalTemplate title="Add Timer" :actions="actions">
        <form ref="formElement">
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="atm-issue" placeholder="issue" v-model="formData.issue">
                <label for="atm-issue" class="form-label">Issue #</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="atm-title" placeholder="title" v-model.trim="formData.title">
                <label for="atm-title" class="form-label">Timer Title</label>
            </div>
            <div class="input-group mb-3">
                <input
                    type="number"
                    class="form-control"
                    id="atm-hours"
                    placeholder="Hrs."
                    :value="formData.time.hours"
                />
                <span class="input-group-text">:</span>
                <input
                    type="number"
                    class="form-control"
                    id="atm-minutes"
                    placeholder="Mins."
                    :value="formData.time.minutes"
                />
                <span class="input-group-text">:</span>
                <input
                    type="number"
                    class="form-control"
                    id="atm-seconds"
                    placeholder="Secs."
                    :value="formData.time.seconds"
                />
            </div>
            <div class="mb-3">
                <label for="atm-billable" class="form-label">Timer Bill Status</label>
                <select class="form-select" id="atm-billable" v-model="formData.billStatus">
                    <option selected>Non-Billable</option>
                    <option>Billable Time</option>
                    <option>SOW Line Item</option>
                    <option>MIE Goodwill (non-billable)</option>
                </select>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="atm-comment" placeholder="comment" v-model.trim="formData.comment">
                <label for="timer-comment" class="form-label">Timer Comment</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="atm-link" placeholder="meeting link" v-model.trim="formData.link">
                <label for="timer-link" class="form-label">Timer Meeting Link</label>
            </div>
        </form>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>