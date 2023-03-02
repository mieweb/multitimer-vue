<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import HMS from '../data/HMS';
import { BillStatus, TimerForm, formToInterface } from '../data/TimerInterface';
import { TimerSystem } from '../data/TimerSystem';
import type { ModalData } from '../data/ModalHandler';
import { Settings } from '../data/Settings';

const props = defineProps<{
	modalData: ModalData
}>();

const formDataCollection = props.modalData.importMeetingData?.map(meeting => {
	const startEndDifference = new Date(meeting.end).getTime() - new Date(meeting.start).getTime();
	const time = HMS.fromSeconds(startEndDifference / 1000);
	const timerForm: TimerForm = {
		issue: meeting.issue,
		title: meeting.title,
		time: time,
		billStatus: 'Non-Billable' as BillStatus,
		comment: '',
		link: meeting.link,
		chosen: false,
		activity: Settings.defaultActivity
	};

	return timerForm;
}) || [];
const actions: Action[] = [
	{
		title: 'Create timer(s)',
		action: () => {
			TimerSystem.importOutlookMeetings(
				formDataCollection
					.filter(formData => formData.chosen)
					.map(formToInterface)
			);
		},
		closeModal: true,
		classes: 'btn-primary',
		disabled: formDataCollection.length ? false : true
	}
];

const randomReaction = () => {
	const reactions = [ '😖', '😯', '😴', 'ಠ_ಠ', '(╯°□°）╯︵ ┻━┻', '(⌐■_■)'];
	const randomIndex = Math.floor(Math.random() * reactions.length);
	return reactions[randomIndex];
};
</script>
<template>
	<ModalTemplate
		:actions="actions"
		title="Import Modals from Outlook"
	>
		<div v-if="formDataCollection.length === 0">
			<p>No meeting timers could be found {{ randomReaction() }}</p>
		</div>
		<div
			v-for="formData of formDataCollection"
			v-else
			:key="formData.issue"
			class="detected-meeting"
		>
			<div class="form-floating mb-3">
				<input
					id="atm-issue"
					v-model="formData.issue"
					type="number"
					class="form-control"
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
					<option selected>
						Non-Billable
					</option>
					<option>Billable Time</option>
					<option>SOW Line Item</option>
					<option>MIE Goodwill (non-billable)</option>
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
			<div class="mb-3 form-check">
				<label
					class="form-check-label"
					for="add-timer-cb"
				>Add This Timer</label>
				<input
					v-model="formData.chosen"
					type="checkbox"
					class="form-check-input add-timer-cb"
				>
			</div>
			<hr>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>
<style>
.detected-meeting:nth-last-child(1) > hr {
	display: none;
}
</style>
