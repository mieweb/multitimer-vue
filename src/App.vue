<script setup lang="ts">
import { defaultStatus } from './data/BillStatus';
import HMS from './data/HMS';
import TimerInterface from './data/TimerInterface';
import TimerList from './components/TimerList.vue';
import HeaderBar from './components/HeaderBar.vue';
import ModalComp from './components/Modal.vue';
import TopControls from './components/TopControls.vue';
import ModalContent from './modals/ModalContent.vue';
import AddTimer from './modals/AddTimer.vue';
import Settings from './modals/Settings.vue';
import QuickTimers from './modals/QuickTimers.vue'
import Help from './modals/Help.vue';
import DeleteTimer from './modals/DeleteTimer.vue';
import EditTimer from './modals/EditTimer.vue';
import TotalTimer from './components/TotalTimer.vue';
import BottomControls from './components/BottomControls.vue';
import { Modal } from 'bootstrap';
import { onMounted, ref } from 'vue';
import { openModal, show, componentReference } from './data/ModalHandler';
import TestModal from './modals/TestModal.vue';

const openTest = () => openModal(TestModal);
const openAdd = () => openModal(AddTimer);
const modalData = componentReference();
</script>

<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="atm-label" aria-hidden="true" id="modal-container">
    <div class="modal-dialog">
      <component :is="modalData.component.value" :generic="modalData.props"/>
    </div>
  </div>
  <HeaderBar />
  <TopControls />
  <TotalTimer />
  <TimerList />
  <BottomControls />
</template>