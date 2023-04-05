<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import { activities, rawToTimerData, RawTimerData } from '../data/TimerData';
import { reactive } from 'vue';
import { TimerSystem } from '../data/TimerSystem';
import { Settings } from '../data/Settings';

defineEmits(['addTimer', 'splitTimer']);

const formData: Omit<RawTimerData, 'controlsHidden' | 'lastUsed'> = reactive({
	issue: '',
	title: '',
	time: {
		hours: NaN,
		minutes: NaN,
		seconds: NaN
	},
	billStatus: 'Non-Billable',
	comment: '',
	link: '',
	activity: Settings.defaultActivity,
});

const clearFormData = () => {
	formData.issue = '';
	formData.title = '';
	formData.time.hours = NaN;
	formData.time.minutes = NaN;
	formData.time.seconds = NaN;
	formData.comment = '';
};

const actions: Action[] = [
	{
		title: 'Split Timer',
		action: () => {
			TimerSystem.splitTimer(rawToTimerData(formData));
			clearFormData();
		},
		closeModal: true
	},
	{
		title: 'Add Timer',
		action: () => {
			TimerSystem.addTimer(rawToTimerData(formData));
			clearFormData();
		},
		classes: 'btn-primary',
		hotkey: 'Enter'
	}
];
</script>

<template>
	<ModalTemplate
		title="Add Timer"
		:actions="actions"
	>
		<form>
			<div class="form-floating mb-3">
				<input
					id="atm-issue"
					v-model="formData.issue"
					type="number"
					class="form-control modal-focus-input"
					placeholder="issue"
				>
				<label
					for="atm-issue"
					class="form-label"
				>Issue #</label>
			</div>
			<div class="form-floating mb-3">
				<input
					id="atm-title"
					v-model.trim="formData.title"
					type="text"
					class="form-control"
					placeholder="title"
				>
				<label
					for="atm-title"
					class="form-label"
				>Timer Title</label>
			</div>
			<div class="input-group mb-3">
				<input
					id="atm-hours"
					v-model="formData.time.hours"
					type="number"
					class="form-control"
					placeholder="Hrs."
				>
				<span class="input-group-text">:</span>
				<input
					id="atm-minutes"
					v-model="formData.time.minutes"
					type="number"
					class="form-control"
					placeholder="Mins."
				>
				<span class="input-group-text">:</span>
				<input
					id="atm-seconds"
					v-model="formData.time.seconds"
					type="number"
					class="form-control"
					placeholder="Secs."
				>
			</div>
			<div class="mb-3">
				<label
					for="atm-billable"
					class="form-label"
				>Timer Bill Status</label>
				<select
					id="atm-billable"
					v-model="formData.billStatus"
					class="form-select"
				>
					<option>
						Non-Billable
					</option>
					<option>Billable Time</option>
					<option>SOW Line Item</option>
					<option>MIE Goodwill (non-billable)</option>
				</select>
			</div>
			<div class="mb-3">
				<label
					for="atm-activity"
					class="form-label"
				>Timer Activity</label>
				<select
					id="atm-activity"
					v-model="formData.activity"
					class="form-select"
				>
					<option
						v-for="entry of activities"
						:key="entry.activity"
					>
						{{ entry.activity }}
					</option>
				</select>
			</div>
			<div class="form-floating mb-3">
				<input
					id="atm-comment"
					v-model.trim="formData.comment"
					type="text"
					class="form-control"
					placeholder="comment"
				>
				<label
					for="timer-comment"
					class="form-label"
				>Timer Comment</label>
			</div>
			<div class="form-floating mb-3">
				<input
					id="atm-link"
					v-model.trim="formData.link"
					type="text"
					class="form-control"
					placeholder="meeting link"
				>
				<label
					for="timer-link"
					class="form-label"
				>Timer Meeting Link</label>
			</div>
		</form>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>