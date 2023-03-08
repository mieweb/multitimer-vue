<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import Action from '../data/Action';
import type { ModalData } from '../data/ModalHandler';

const props = defineProps<{
	modalData: ModalData
}>();
const actions: Action[] = [
	{
		title: 'Remove Timer',
		action: () => {
			TimerSystem.deleteTimer(props.modalData.timerId);
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
		:title="'Remove Timer?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to remove this timer?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>