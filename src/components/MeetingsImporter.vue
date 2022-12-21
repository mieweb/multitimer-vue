<script setup lang="ts">
import { importMeetings } from '../data/ImportMeetings';
import ImportMeetings from '../modals/ImportMeetings.vue';
import Help from '../modals/Help.vue';
import { openModal } from '../data/ModalHandler';

const beginImport = async () => {
    const generic = {
        meetingData: await importMeetings()
    };

    openModal(ImportMeetings, generic);
}

</script>
<template>
    <button 
        @click="beginImport"
        class="btn btn-primary"
    >Import Meetings from Outlook</button>
</template>
<script lang="ts">export default {};</script>