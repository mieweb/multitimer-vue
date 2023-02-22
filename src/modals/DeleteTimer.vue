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
		title: 'Delete Timer',
		action: () => {
			TimerSystem.deleteTimer(props.modalData.timerId);
		},
		closeModal: true,
		classes: 'btn-danger'
	}
];

</script>
<template>
	<ModalTemplate
		:actions="actions"
		:title="'Delete Timer?'"
	>
		<div class="modal-body">
			<label class="form-label">Are you sure you want to delete this timer?</label>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>