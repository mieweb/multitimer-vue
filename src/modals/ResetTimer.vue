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
		title: 'Reset Timer',
		action: () => {
			TimerSystem.resetTimer(props.modalData.timerId);
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
		title="Reset Timer?"
	>
		<label class="form-label">Are you sure you want to reset this timer?</label>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>