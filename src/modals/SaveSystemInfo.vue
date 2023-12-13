<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import type { ModalData } from '../data/ModalHandler';
import { defineProps } from 'vue';
import { SaveSystemStatus } from '../data/SaveSystem';

defineProps<{
	modalData: ModalData
}>();
</script>


<template>
	<ModalTemplate
		title="Saving Info"
	>
		<div class="fst-italic pb-3">Information since the last save:</div>
		<div
			id="saving-info-accordion"
			class="accordion"
		>
			<div 
				v-for="info of modalData.systemsInfo"
				:key="info.name"
				class="accordion-item"
			>
				<h2 class="accordion-header">
					<div
						class="accordion-button collapsed"
						:class="info.status !== SaveSystemStatus.Failed && 'no-error-info'"
						type="button"
						data-bs-toggle="collapse"
						:data-bs-target="`#${info.name.replaceAll(' ', '')}`"
					>
						<i
							v-if="info.status === SaveSystemStatus.Succeeded"
							class="fa-solid fa-check text-success pe-2"
						/>
						<i
							v-else-if="info.status === SaveSystemStatus.Prepared"
							class="fa-solid fa-minus text-success pe-2"
						/>
						<i
							v-else-if="info.status === SaveSystemStatus.Failed"
							class="fa-solid fa-xmark text-danger pe-2"
						/>
						{{ info.name }}
					</div>
				</h2>
				<div
					v-if="info.status === SaveSystemStatus.Failed"
					:id="info.name.replaceAll(' ', '')"
					class="accordion-collapse collapse"
					data-bs-parent="#saving-info-accordion"
				>
					<div 
						class="accordion-body bg-danger-subtle"
					>
						{{ info.statusMessage }}
					</div>
				</div>
			</div>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>import Action from "../data/Action.1";

<style>
	.no-error-info::after {
		background-image: none;
	}

	.no-error-info {
		cursor: default !important;
	}
</style>