<script setup lang="ts">
import Action from '../data/Action';
import { clearModal } from '../data/ModalHandler';

defineProps<{
    actions?: Action[],
    title: string
}>();

const handleAction = (action: Action) => action.action();

const handleHotkey = (event: KeyboardEvent, actions: Action[] | undefined) => {
	if (!actions) return;
	for (const action of actions) {
		if (!action.hotkey) continue;

		console.log(event.key);
		if (event.key === action.hotkey) {
			event.preventDefault();
			handleAction(action);
		}
	}
};
</script>

<template>
	<div
		class="modal-content"
		@keypress="(event) => handleHotkey(event, actions)"
	>
		<div class="modal-header">
			<h5
				id="atm-label"
				class="modal-title"
			>
				{{ title }}
			</h5>
			<button
				type="button"
				class="btn-close"
				data-bs-dismiss="modal"
				aria-label="Close"
			/>
		</div>
		<div class="modal-body">
			<slot />
		</div>
		<div class="modal-footer">
			<button
				type="button"
				class="btn btn-secondary"
				data-bs-dismiss="modal"
			>
				Close
			</button>
			<button 
				v-for="(a, i) in actions" 
				:key="i" 
				:class="`btn ${(a.classes ? a.classes : 'btn-outline-primary')}`" 
				:data-bs-dismiss="a.closeModal ? 'modal' : ''"
				:disabled="a.disabled"
				@click="handleAction(a)"
			>
				{{ a.title }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">export default {};</script>