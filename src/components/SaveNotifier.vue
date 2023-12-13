<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { openModal } from '../data/ModalHandler';
import SavingInfo from '../modals/SaveSystemInfo.vue';
import { getSaveNotifier } from '../data/SaveSystem';
enum SavingState {
	InProgress,
	Incomplete,
	Complete,
	Failed
}
const saveState = ref<SavingState>(SavingState.Complete);
const saveInfoCompleteE = ref<HTMLDivElement>();
const saveInfoFailedE = ref<HTMLDivElement>();
const saveInfoProgressE = ref<HTMLDivElement>();

const showElement = (e: Ref<HTMLDivElement | undefined>) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	e.value!.hidden = false;
};

document.addEventListener('save:start', () => {
	saveState.value = SavingState.InProgress;
	// hideAllSaveInfo();
	// showElement(saveInfoProgressE);
});

document.addEventListener('save:complete', () => {
	saveState.value = SavingState.Complete;
	// hideAllSaveInfo();
	// showElement(saveInfoCompleteE);
});

document.addEventListener('save:incomplete', () => {
	saveState.value = SavingState.Incomplete;
	// hideAllSaveInfo();
	// showElement(saveInfoIncompleteE);
});

onMounted(() => {
	showElement(saveInfoCompleteE);
});

const openSavingInfo = async () => {
	const notifier = getSaveNotifier();
	const systemsInfo = notifier.systemStatuses();
	openModal(SavingInfo, {
		systemsInfo
	});
};

</script>
<template>
	<div 
		id="saving-info" 
		class="plain-btn pointer"
		@click="openSavingInfo"
	>
		<div
			v-if="saveState === SavingState.Complete"
			id="saving-info-complete"
			ref="saveInfoCompleteE"
		>
			<i class="fa-solid fa-check text-success pe-1" />
			<span class="text-secondary">Save complete.</span>
		</div>
		<div
			v-else-if="saveState === SavingState.Failed"
			id="saving-info-failed"
			ref="saveInfoFailedE"
		>
			<i class="fa-solid fa-xmark text-danger pe-1" />
			<span class="text-secondary">Save failed.</span>
		</div>
		<div
			v-else-if="saveState === SavingState.Incomplete"
			id="saving-info-failed"
			ref="saveInfoFailedE"
		>
			<i class="fa-solid fa-minus text-warning pe-1" />
			<span class="text-secondary">Save incomplete.</span>
		</div>
		<div
			v-else-if="saveState === SavingState.InProgress"
			id="saving-info-progress"
			ref="saveInfoProgressE"
		>
			<span class="pe-1">
				<span class="spinner-border spinner-border-sm text-secondary" />
			</span>
			<span class="text-secondary">Saving....</span>
		</div>
	</div>/
</template>
<script lang="ts">export default {};</script>
<style>
	#saving-info {
		position: fixed;	
		bottom: 1rem;
		right: 1rem;
	}
</style>