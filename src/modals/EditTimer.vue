<script setup lang="ts">
import { ref } from 'vue';
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import { TimerSystem } from '../data/TimerSystem';
import { partialToInterface, TimerInterface } from '../data/TimerInterface';

const formElement = ref<HTMLFormElement>();
const selectedTimer = TimerSystem.selectedTimerData();
const formData: Pick<TimerInterface, 'issue' | 'title' | 'link'> = {
	issue: selectedTimer?.issue || '',
	title: selectedTimer?.title || '',
	link: selectedTimer?.link || ''
};
const clearFormData = () => {
	formData.issue = '';
	formData.title = '';
	formData.link = '';
};
const actions: Action[] = [
	{
		title: 'Update Timer',
		action: () => {
			TimerSystem.editTimer(partialToInterface(formData));
			formElement?.value?.reset();
			// clearFormData();
		},
		closeModal: true,
		classes: 'btn-primary'
	}
];
</script>
<template>
	<ModalTemplate
		:actions="actions"
		:modal-id="'edit-timer-modal'"
		:title="'Edit Timer'"
	>
		<form ref="formElement">
			<div class="modal-body">
				<div class="form-floating mb-3">
					<input
						id="etm-issue"
						v-model="formData.issue"
						type="number"
						class="form-control"
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