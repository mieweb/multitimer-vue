<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
const actions: Action[] = [
	{
		title: 'Delete All',
		action: () => {
			TimerSystem.resetAllTimers();
		},
		closeModal: true,
		classes: 'btn-danger'
	}
];

</script>
<template>
	<ModalTemplate
		:actions="actions"
		:title="'Reset All Timers?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to delete all timers?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>