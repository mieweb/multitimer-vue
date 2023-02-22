<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
import HMS from '../data/HMS';
import type { ModalData } from '../data/ModalHandler';

const props = defineProps<{
	modalData: ModalData
}>();
const formData = {
	toSubtract: false,
	hoursRef: NaN,
	minutesRef: NaN,
	secondsRef: NaN
};

const actions: Action[] = [
	{
		title: 'Update Timer',
		action: () => {
			let signFactor = 1;
			if (formData.toSubtract) {
				signFactor = -1;
			}
			const hms = new HMS(
				formData.hoursRef * signFactor,
				formData.minutesRef * signFactor,
				formData.secondsRef * signFactor,
			);
			TimerSystem.updateTime(props.modalData.timerId, hms);
		},
		closeModal: true,
		classes: 'btn-primary',
		hotkey: 'Enter'
	}
];

</script>
<template>
	<ModalTemplate
		:actions="actions"
		title="Update Time?"
	>
		<div class="form-check form-switch">
			<input
				id="atim-switch"
				v-model="formData.toSubtract"
				class="form-check-input"
				type="checkbox"
				role="switch"
			>
			<label for="atim-switch">Check to Subtract Time</label>
		</div>
		<div class="input-group mb-3">
			<input
				id="atim-hours"
				v-model="formData.hoursRef"
				type="number"
				class="form-control"
				placeholder="Hrs."
			>
			<span class="input-group-text">:</span>
			<input
				id="atim-minutes"
				v-model="formData.minutesRef"
				type="number"
				class="form-control"
				placeholder="Mins."
			>
			<span class="input-group-text">:</span>
			<input
				id="atim-seconds"
				v-model="formData.secondsRef"
				type="number"
				class="form-control"
				placeholder="Secs."
			>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>