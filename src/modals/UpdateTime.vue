<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import type { Action } from '../components/ModalTemplate.vue';
import HMS from '../data/HMS';
import type { ModalData } from '../data/ModalHandler';
import { Settings } from '../data/Settings';

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
		title: 'Round Down Timer',
		action: () => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const oldTime = HMS.clone(props.modalData.timerData.time!);
			let minutes = oldTime.getMinutes();
			let seconds = oldTime.getSeconds();

			for (minutes; minutes % Settings.roundToMinutes != 0; minutes -= 1) {
				minutes -= 1;
			}
			seconds = -oldTime.getSeconds();

			TimerSystem.updateTime(props.modalData.timerId, HMS.fromHumanReadable(0, minutes, seconds));
		},
		closeModal: true,
		classes: 'btn-outline-primary',
	},
	{
		title: 'Update Timer',
		action: () => {
			const signFactor = formData.toSubtract ? -1 : 1;
			const hours = isNaN(formData.hoursRef) ? 0 : formData.hoursRef;
			const minutes = isNaN(formData.minutesRef) ? 0 : formData.minutesRef;
			const seconds = isNaN(formData.secondsRef) ? 0 : formData.secondsRef;
			const hms = HMS.fromHumanReadable(
				hours * signFactor,
				minutes * signFactor,
				seconds * signFactor,
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
<script lang="ts">export default {};</script>import Action from "../data/Action.1";
