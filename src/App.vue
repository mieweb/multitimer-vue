<script setup lang="ts">
import TimerList from './components/TimerList.vue';
import HeaderBar from './components/HeaderBar.vue';
import TopControls from './components/TopControls.vue';
import TotalTimer from './components/TotalTimer.vue';
import BottomControls from './components/BottomControls.vue';
import { componentReference } from './data/ModalHandler';

const modalData = componentReference();
</script>

<template>
	<div
		id="modal-container"
		class="modal fade"
		tabindex="-1"
		aria-labelledby="atm-label"
		aria-hidden="true"
	>
		<div class="modal-dialog">
			<component
				:is="modalData.component.value"
				:modal-data="modalData.props"
			/>
		</div>
	</div>
	<HeaderBar />
	<TopControls />
	<TotalTimer />
	<TimerList />
	<BottomControls />
</template>