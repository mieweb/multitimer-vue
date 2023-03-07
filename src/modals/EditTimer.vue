<script setup lang="ts">
import { ref } from 'vue';
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import { TimerSystem } from '../data/TimerSystem';
import { RawTimerData } from '../data/TimerData';
import type { ModalData } from '../data/ModalHandler';

const props = defineProps<{
	modalData: ModalData
}>();

const formElement = ref<HTMLFormElement>();
const formData: Pick<RawTimerData, 'issue' | 'title' | 'link'> = {
	issue: props.modalData.timerData.issue || '',
	title: props.modalData.timerData.title || '',
	link: props.modalData.timerData.link || ''
};
// const clearFormData = () => {
// 	formData.issue = '';
// 	formData.title = '';
// 	formData.link = '';
// };
const actions: Action[] = [
	{
		title: 'Update Timer',
		action: () => {
			formData.issue = ((formData.issue as unknown) as number).toString(); // This converts to a number by Vue, convert back to string
			TimerSystem.editTimer(props.modalData.timerId, formData);
			formElement?.value?.reset();
			// clearFormData();
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
		:title="'Edit Timer'"
	>
		<form ref="formElement">
			<div class="modal-body">
				<div class="form-floating mb-3">
					<input
						id="etm-issue"
						v-model="formData.issue"
						type="number"
						class="form-control modal-focus-input"
						placeholder="New Issue"
						maxlength="6"
					>
					<label for="etm-title">New Issue #</label>
				</div>
				<div class="form-floating mb-3">
					<input
						id="etm-title"
						v-model="formData.title"
						type="text"
						class="form-control"
						placeholder="New Title"
					>
					<label for="etm-title">New Title</label>
				</div>
				<div class="form-floating mb-3">
					<input
						id="etm-link"
						v-model="formData.link"
						type="text"
						class="form-control"
						placeholder="New Link"
					>
					<label for="etm-link">New Meeting Link</label>
				</div>
			</div>
		</form>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>