<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { Settings } from '../data/Settings';
import { ref } from 'vue';
import Action from '../data/Action';

const formRefs: { [index: string]: any } = {};

for (const key of Object.keys(Settings)) {
    formRefs[key] = Settings[key];
}

const saveAction = () => {
    debugger;
    Settings.updateSettings(formRefs);
};

const actions: Action[] = [
    {
        title: 'Save',
        action: saveAction,
        classes: 'btn-success',
        closeModal: true
    }
];

</script>
<template>
    <ModalTemplate :actions="actions" :title="'Settings'">
        <h5>General</h5>
        <hr>
        <div class="mb-3">
            <label class="form-label" for="autosave-timeout"
                >Minutes between every autosave:</label
            >
            <input
                class="form-control"
                type="number"
                id="autosave-timeout"
                v-model="formRefs.autosaveInterval"
            />
        </div>
        <h5>Logging</h5>
        <hr>
        <div class="mb-3">
            <label class="form-label" for="round-minute"
                >Minute Increment To Round To:</label
            >
            <input
                class="form-control"
                type="number"
                id="round-minute"
                v-model="formRefs.roundToMinutes"
            />
        </div>
        <h5>Timers</h5>
        <hr>
        <div>
            <label class="form-label" for="timer-width">
                Timer width (in percentage):
            </label>
            <div class="input-group mb-3">
                <input type="number" class="form-control" id="timer-width" name="timer-width" v-model="formRefs.timerWidth">
                <span class="input-group-text">%</span>
            </div>
        </div>
        <div class="mb-3 form-check">
            <label class="form-check-label" for="hide-options"
                >Hide Timer Options</label
            >
            <input
                class="form-check-input"
                type="checkbox"
                id="hide-options"
                v-model="formRefs.hideOptions"
            />
        </div>
        <div class="mb-3 form-check">
            <label class="form-check-label" for="hide-controls"
                >Compact New Timers</label
            >
            <input
                class="form-check-input"
                type="checkbox"
                id="hide-controls"
                v-model="formRefs.hideControls"
            />
        </div>
        <h5>Meetings</h5>
        <hr>
        <div class="mb-3">
            <label class="form-label" for="meeting-detect-preset">
                Detect meetings...
            </label>
            <div name="meeting-detect-preset">
                <div class="form-check">
                    <input type="radio" class="form-check-input" name="meeting-detect-choice" value="D" v-model="formRefs.meetingDetectPreset">
                    <label class="form-label" for="meeting-detect-choice">...by day</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" name="meeting-detect-choice" value="W" v-model="formRefs.meetingDetectPreset">
                    <label class="form-label" for="meeting-detect-choice">...by week</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" name="meeting-detect-choice" value="M" v-model="formRefs.meetingDetectPreset">
                    <label class="form-label" for="meeting-detect-choice">...by month</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" name="meeting-detect-choice" value="R" v-model="formRefs.meetingDetectPreset">
                    <label class="form-label" for="meeting-detect-choice">...by range</label>
                </div>
                <div class="input-group">
                    <input id="meeting-range-start" class="form-control" type="date" v-model="formRefs.meetingDetectStart">
                    <span class="input-group-text">🡒</span>
                    <input id="meeting-range-end" class="form-control" type="date" v-model="formRefs.meetingDetectEnd">
                </div>
            </div>
        </div>
        <!-- <div>
            <label class="form-label" for="meeting-date-range">
                Date range to detect meetings:
            </label>
            <div class="input-group mb-3" name="meeting-date-range">
                <input type="date" class="form-control" id="meeting-detect-start">
                <span class="input-group-text">🡒</span>
                <input type="date" class="form-control" id="meeting-detect-end">
            </div>
        </div> -->
        <h5>Exporting</h5>
        <hr>
        <button id="export-data" class="mb-3 btn btn-outline-primary">Export Timer Data</button>
        <div class="input-group mb-3">
            <button class="btn btn-outline-success" id="import-data">Import Timer Data</button>
            <input class="form-control" type="file" id="import-files" accept=".json">
        </div>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>