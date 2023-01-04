<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { Settings, SettingsInterface } from '../data/Settings';
import Action from '../data/Action';
import { TimerSystem } from '../data/TimerSystem';

const formData = Settings.dataCopy();

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
	const fileUpload = document.querySelector('#import-files') as HTMLInputElement;
	if (!fileUpload.files) {
		return;
	}
	const file = fileUpload.files[0];
	fileUpload.value = '';

	if (!file) return;
	TimerSystem.importFromFile(file);
};

const exportData = () => {
	const a = document.createElement('a');
	const saveData = JSON.stringify(TimerSystem.saveData());
	const date = new Date().toISOString().slice(0, 19).replace('T', '_');
	a.href = URL.createObjectURL(
		new Blob([saveData], {
			type: 'application/json'
		})
	);
	a.download = `save-data-${date}`;
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
				id="round-minute"
				v-model="formData.roundToMinutes"
				class="form-control"
				type="number"
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
		<button
			id="export-data"
			class="mb-3 btn btn-outline-primary"
			@click="exportData"
		>
			Export Timer Data
		</button>
		<div class="input-group mb-3">
			<button
				id="import-data"
				class="btn btn-outline-success"
				@click="importData"
			>
				Import Timer Data
			</button>
			<input
				id="import-files"
				class="form-control"
				type="file"
				accept=".json"
			>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>