<script setup lang="ts">
import Action from '../data/Action';
import { clearModal } from '../data/ModalHandler';

defineProps<{
    actions?: Action[],
    title: string
}>();

const handleAction = (action: Action) => {
	action.action();
	if (action.closeModal) {
		clearModal();
	}
};

</script>

<template>
	<div class="modal-content">
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
				:class="'btn ' + (a.classes ? a.classes : 'btn-outline-primary')" 
				:data-bs-dismiss="a.closeModal ? 'modal' : ''"
				@click="handleAction(a)"
			>
				{{ a.title }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">export default {};</script>