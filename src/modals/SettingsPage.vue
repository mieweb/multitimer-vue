<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { Settings, SettingsInterface } from '../data/Settings';
import type { Action } from '../components/ModalTemplate.vue';
import { TimerSystem, TimerSystemData } from '../data/TimerSystem';
import { ref } from 'vue';
import { activities } from '../data/TimerData';

const formData = Settings.dataCopy();
const fileUpload = ref<HTMLInputElement>();

const saveAction = () => {
	const validRange = validateMeetingRange(formData);
	Settings.updateSettings({
		...formData,
		...validRange
	});

	function validateMeetingRange(validRange: Pick<SettingsInterface, 'meetingDetectStart' | 'meetingDetectEnd'>) {
		const startEnd = {
			...validRange
		};
		const startDate = new Date(startEnd.meetingDetectStart);
		const endDate = new Date(startEnd.meetingDetectEnd);

		if (startDate.getTime() > endDate.getTime()) {
			startEnd.meetingDetectStart = Settings.meetingDetectStart;
			startEnd.meetingDetectEnd = Settings.meetingDetectEnd;
		}

		return startEnd;
	}
};

const importData = () => {
	if (!fileUpload.value || !fileUpload.value.files) {
		return;
	}
	const file = fileUpload.value.files[0];
	fileUpload.value.files = null;

	if (!file) return;
	file.text().then(jsonText => {
		const timerData = JSON.parse(jsonText) as TimerSystemData;
		TimerSystem.timersFromRaw(timerData.timers);
		TimerSystem.favoriteTimersFromList(timerData.favoriteTimers);
	});
};

const recoverData = () => {
	const localStorageTimers = localStorage.getItem('timers');
	const localStorageFavorites = localStorage.getItem('favoriteTimers');
	const rawTimers = localStorageTimers ? JSON.parse(localStorageTimers) : [];
	const rawFavorites = localStorageFavorites ? JSON.parse(localStorageFavorites) : [];
	TimerSystem.timersFromRaw(rawTimers);
	TimerSystem.favoriteTimersFromList(rawFavorites);
};

const exportData = () => {
	const a = document.createElement('a');
	const saveData = JSON.stringify(TimerSystem.toTimerSystemData());
	const date = new Date().toISOString().slice(0, 10);
	a.href = URL.createObjectURL(
		new Blob([saveData], {
			type: 'application/json'
		})
	);
	a.download = `multitimer-${date}`;
	a.click();
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
	<ModalTemplate
		:actions="actions"
		:title="'Settings'"
	>
		<h5>General</h5>
		<hr>
		<div class="mb-3">
			<label
				class="form-label"
				for="autosave-timeout"
			>Minutes between every autosave:</label>
			<input
				id="autosave-timeout"
				v-model="formData.autosaveInterval"
				class="form-control"
				type="number"
			>
		</div>
		<h5>Logging</h5>
		<hr>
		<div class="mb-3">
			<label
				class="form-label"
				for="round-minute"
			>Minute Increment To Round To:</label>
			<input
				v-model="formData.roundToMinutes"
				name="round-minute"
				class="form-control"
				type="number"
			>
		</div>
		<div class="mb-3">
			<label
				class="form-label"
				for="default-activity"
			>Default activity for new timers:</label>
			<select
				v-model="formData.defaultActivity"
				class="form-select"
				name="default-activity"
			>
				<option
					v-for="entry of activities"
					:key="entry.activity"
				>
					{{ entry.activity }}
				</option>
			</select>
		</div>
		<div class="mb-3 form-check">
			<label
				class="form-check-label"
				for="last-used-logging"
			>Used last used time for logging</label>
			<input
				id="last-used-logging"
				v-model="formData.lastUsedForLogging"
				name="last-used-logging"
				class="form-check-input"
				type="checkbox"
			>
		</div>
		<h5>Timers</h5>
		<hr>
		<div>
			<label
				class="form-label"
				for="timer-width"
			>
				Timer width (in percentage):
			</label>
			<div class="input-group mb-3">
				<input
					id="timer-width"
					v-model="formData.timerWidth"
					type="number"
					class="form-control"
					name="timer-width"
				>
				<span class="input-group-text">%</span>
			</div>
		</div>
		<div class="mb-3 form-check">
			<label
				class="form-check-label"
				for="hide-options"
			>Hide Timer Options</label>
			<input
				id="hide-options"
				v-model="formData.hideOptions"
				class="form-check-input"
				type="checkbox"
			>
		</div>
		<div class="mb-3 form-check">
			<label
				class="form-check-label"
				for="hide-controls"
			>Compact New Timers</label>
			<input
				id="hide-controls"
				v-model="formData.hideControls"
				class="form-check-input"
				type="checkbox"
			>
		</div>
		<div class="mb-3 form-check">
			<label
				class="form-check-label"
				for="start-on-timer-click"
			>Start on clicking the timer</label>
			<input
				id="start-on-timer-click"
				v-model="formData.startOnTimerClick"
				class="form-check-input"
				type="checkbox"
			>
		</div>
		<div class="mb-3 form-check">
			<label
				class="form-check-label"
				for="move-timer-to-top"
			>Move timer to top on start</label>
			<input
				id="move-timer-to-top"
				v-model="formData.moveTimerToTop"
				class="form-check-input"
				type="checkbox"
			>
		</div>
		<h5>Meetings</h5>
		<hr>
		<div class="mb-3">
			<label
				class="form-label"
				for="meeting-detect-preset"
			>
				Detect meetings...
			</label>
			<div name="meeting-detect-preset">
				<div class="form-check">
					<input
						v-model="formData.meetingDetectPreset"
						type="radio"
						class="form-check-input"
						name="meeting-detect-choice"
						value="D"
					>
					<label
						class="form-label"
						for="meeting-detect-choice"
					>...by day</label>
				</div>
				<div class="form-check">
					<input
						v-model="formData.meetingDetectPreset"
						type="radio"
						class="form-check-input"
						name="meeting-detect-choice"
						value="W"
					>
					<label
						class="form-label"
						for="meeting-detect-choice"
					>...by week</label>
				</div>
				<div class="form-check">
					<input
						v-model="formData.meetingDetectPreset"
						type="radio"
						class="form-check-input"
						name="meeting-detect-choice"
						value="M"
					>
					<label
						class="form-label"
						for="meeting-detect-choice"
					>...by month</label>
				</div>
				<div class="form-check">
					<input
						v-model="formData.meetingDetectPreset"
						type="radio"
						class="form-check-input"
						name="meeting-detect-choice"
						value="R"
					>
					<label
						class="form-label"
						for="meeting-detect-choice"
					>...by range</label>
				</div>
				<div class="input-group">
					<input
						id="meeting-range-start"
						v-model="formData.meetingDetectStart"
						class="form-control"
						type="date"
					>
					<span class="input-group-text">🡒</span>
					<input
						id="meeting-range-end"
						v-model="formData.meetingDetectEnd"
						class="form-control"
						type="date"
					>
				</div>
			</div>
		</div>
		<div class="form-check mb-3">
			<input
				v-model="formData.onlyImportIssuedMeetings"
				type="checkbox"
				class="form-check-input"
				name="import-all-meetings"
			>
			<label
				class="form-label"
				for="import-all-meetings"
			>Only import meetings with detectable issue number</label>
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
		<h5>Importing/Exporting</h5>
		<hr>
		<button
			class="mb-3 btn btn-outline-primary"
			@click="exportData"
		>
			Export Save Data
		</button>
		<div class="input-group mb-3">
			<button
				class="btn btn-outline-success"
				@click="importData"
			>
				Import Save Data
			</button>
			<input
				ref="fileUpload"
				class="form-control"
				type="file"
				accept=".json"
			>
		</div>
		<hr>
		<button
			class="mb-3 btn btn-outline-primary"
			ModalTemplate
			@click="recoverData"
		>
			Recover Save Data
		</button>
	</modaltemplate>
</template>
<script lang="ts">export default {};</script>import Action from "../data/Action.1";
