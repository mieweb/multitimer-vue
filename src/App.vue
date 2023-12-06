<script setup lang="ts">
import TimerList from './components/TimerList.vue';
import HeaderBar from './components/HeaderBar.vue';
import TopControls from './components/TopControls.vue';
import TotalTimer from './components/TotalTimer.vue';
import BottomControls from './components/BottomControls.vue';
import ToastSingleton from './components/ToastSingleton.vue';
import SaveNotifier from './components/SaveNotifier.vue';
import { componentReference } from './data/ModalHandler';
import { TimerSystem } from './data/TimerSystem';
import { computed } from 'vue';
import { isMobile } from 'is-mobile';
import { ToastType, showToast } from './data/Toast';

const modalData = componentReference();
const globalToggle = () => {
	if (TimerSystem.activeTimer) {
		console.debug('Stop global');
		TimerSystem.pauseActiveTimer();
	} else {
		console.debug('Start global');
		TimerSystem.startTimer(TimerSystem.activeTimer);
	}
};
const globalToggleClasses = computed(() => TimerSystem.activeTimer ? 'fa-pause active' : 'fa-play inactive');
</script>

<template>
	<div
		id="modal-container"
		class="modal fade"
		tabindex="-1"
		aria-labelledby="atm-label"
		aria-hidden="true"
	>
		<div
			class="modal-dialog"
			:class="isMobile() ? 'modal-dialog-centered' : ''"
		>
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
	<Transition>
		<div
			v-if="TimerSystem.lastTimerUsed"
			id="global-pause-button"
			:class="`p-3 fa ${globalToggleClasses}`"
			@click="globalToggle"
		/>
	</Transition>
	<ToastSingleton />
	<SaveNotifier />
</template>

<style>
	#global-pause-button {
		border-radius: 20%;
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		cursor: pointer;
	}

	.v-enter-active,
	.v-leave-active {
		transition: opacity 250ms ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}

	.inactive {
		background-color: var(--timer-primary);
	}

	.active {
		background-color: var(--timer-active);
	}
</style>