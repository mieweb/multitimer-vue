<script setup lang="ts">
import { ref } from 'vue';
import { getSaveSystem, SaveNotifierState } from '../data/SaveSystem';
const saveSystem = getSaveSystem();
const saveState = ref(SaveNotifierState.Complete);

const manualSave = async () => {
	saveState.value = SaveNotifierState.InProgress; // Hastily made, need to change since some variants aren't used.
	await saveSystem.startSaving();
	saveState.value = SaveNotifierState.Complete;
};
</script>
<template>
	<div 
		id="saving-info" 
		class="plain-btn pointer"
		@click="manualSave"
	>
		<div
			v-if="saveState === SaveNotifierState.Complete"
			id="saving-info-complete"
		>
			<i class="fa-solid fa-check text-success pe-1" />
			<span class="text-secondary">Save complete.</span>
		</div>
		<div
			v-else-if="saveState === SaveNotifierState.Failed"
			id="saving-info-failed"
		>
			<i class="fa-solid fa-xmark text-danger pe-1" />
			<span class="text-secondary">Save incomplete.</span>
		</div>
		<div
			v-else-if="saveState === SaveNotifierState.InProgress"
			id="saving-info-progress"
			hidden
		>
			<span class="pe-1">
				<span class="spinner-border spinner-border-sm text-secondary" />
			</span>
			<span class="text-secondary">Saving....</span>
		</div>
	</div>
</template>
<script lang="ts">export default {};</script>
<style>
	#saving-info {
		position: fixed;	
		bottom: 1rem;
		right: 1rem;
	}
</style>
