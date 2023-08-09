<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import type { Action } from '../components/ModalTemplate.vue';
const actions: Action[] = [
	{
		title: 'Remove All Timers',
		action: () => {
			TimerSystem.removeAllTimers();
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
		:title="'Remove All Timers?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to remove all the timers?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>import Action from "../data/Action.1";
