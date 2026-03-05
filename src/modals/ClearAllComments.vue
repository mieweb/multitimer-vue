<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import type { Action } from '../components/ModalTemplate.vue';
const actions: Action[] = [
	{
		title: 'Clear All Comments',
		action: () => {
			TimerSystem.clearAllComments();
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
		:title="'Clear All Comments?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to clear all comment fields?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>
