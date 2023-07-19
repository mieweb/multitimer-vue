<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import type { Action } from '../components/ModalTemplate.vue';
const actions: Action[] = [
	{
		title: 'Reset All Timers',
		action: () => {
			TimerSystem.resetAllTimers();
		},
		closeModal: true,
		classes: 'btn-danger',
		hotkey: 'Enter'
	}
];

</script>
<template>
	<ModalTemplate
		:actions="actions"
		:title="'Reset All Timers?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to reset all the timers?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>import Action from "../data/Action.1";
