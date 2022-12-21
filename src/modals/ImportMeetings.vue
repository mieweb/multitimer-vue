<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import { Ref, ref } from 'vue';
import HMS from '../data/HMS';
import { MeetingData } from '../data/ImportMeetings';
import TimerInterface, { BillStatus } from '../data/TimerInterface';
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';

const props = defineProps<{
    generic: { meetingData: MeetingData[] }
}>();
const actions: Action[] = [
    {
        title: 'Create timer(s)',
        action: () => {
            const timerDataCollection = formDataCollection
                .filter((formData: { chosen: boolean }) => formData.chosen)
                .map((chosen: any) => {
                    const timerData: TimerInterface = {
                        issue: chosen.issue,
                        title: chosen.title,
                        time: chosen.time,
                        billStatus: chosen.billStatus,
                        comment: chosen.comment,
                        link: chosen.link,
                        controlsHidden: Settings.hideControls
                    };
                    return timerData;
                }).forEach((timerData: TimerInterface) => TimerSystem.addTimer(timerData));
        },
        closeModal: true,
        classes: 'btn-primary'
    }
]
const formDataCollection = props.generic.meetingData.map(meeting => {
    const startEndDifference = new Date(meeting.end).getTime() - new Date(meeting.start).getTime();
    const time = HMS.fromSeconds(startEndDifference / 1000);
    console.log(`time ${time}`);
    return {
        issue: meeting.issue,
        title: meeting.title,
        time: time,
        billStatus: 'Non-Billable' as BillStatus,
        comment: '',
        link: meeting.link,
        chosen: false
    };
});
// const reactions = [ '😖', '😯', '😴', 'ಠ_ಠ', '(╯°□°）╯︵ ┻━┻', '(⌐■_■)'];
// const randomReaction = () => reactions[Math.floor(Math.random() * reactions.length)];
</script>
<template>
    <ModalTemplate :actions="actions" title="Import Modals from Outlook">
        <div v-if="formDataCollection.length === 0"><p>No meeting timers could be found</p></div>
        <form v-else v-for="formData of formDataCollection" :key="formData.issue" ref="formElement">
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
            <div class="mb-3 form-check">
                <label class="form-check-label" for="add-timer-cb">Add This Timer</label>
                <input type="checkbox" class="form-check-input add-timer-cb" v-model="formData.chosen">
            </div>
        </form>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>