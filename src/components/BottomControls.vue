<script setup lang="ts">
import { importMeetings } from '../data/ImportMeetings';
import ImportMeetings from '../modals/ImportMeetings.vue';
import { openModal } from '../data/ModalHandler';

const beginImport = async () => {
	openModal(ImportMeetings, { importMeetingData: await importMeetings() });
};

</script>
<template>
	<div class="d-flex flex-column align-items-center pt-4 text-secondary">
		<button 
			class="btn btn-primary"
			@click="beginImport"
		>
			Import Meetings from Outlook
		</button>
	</div>
</template>