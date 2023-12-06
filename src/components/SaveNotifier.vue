<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
const saveInfoCompleteE = ref<HTMLDivElement>();
const saveInfoFailedE = ref<HTMLDivElement>();
const saveInfoProgressE = ref<HTMLDivElement>();
const hideAllSaveInfo = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	saveInfoProgressE.value!.hidden = true;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	saveInfoFailedE.value!.hidden = true;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	saveInfoCompleteE.value!.hidden = true;
};

const showElement = (e: Ref<HTMLDivElement | undefined>) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	e.value!.hidden = false;
};

document.addEventListener('save:start', () => {
	hideAllSaveInfo();
	showElement(saveInfoProgressE);
});

document.addEventListener('save:complete', () => {
	hideAllSaveInfo();
	showElement(saveInfoCompleteE);
});

onMounted(() => {
	showElement(saveInfoCompleteE);
});

const manualSave = () => {
	document.dispatchEvent(new Event('save:request'));
};
</script>
<template>
	<div 
		id="saving-info" 
		class="plain-btn pointer"
		@click="manualSave"
	>
		<div
			id="saving-info-complete"
			ref="saveInfoCompleteE"
			hidden
		>
			<i class="fa-solid fa-check text-success pe-1" />
			<span class="text-secondary">Save complete.</span>
		</div>
		<div
			id="saving-info-failed"
			ref="saveInfoFailedE"
			hidden
		>
			<i class="fa-solid fa-xmark text-danger pe-1" />
			<span class="text-secondary">Save incomplete.</span>
		</div>
		<div
			id="saving-info-progress"
			ref="saveInfoProgressE"
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