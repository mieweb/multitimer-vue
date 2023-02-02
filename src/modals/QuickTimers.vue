<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import { partialToInterface, TimerInterface } from '../data/TimerInterface';
import { callWithAsyncErrorHandling } from 'vue';

const addTimer = (timer: TimerInterface) => {
	TimerSystem.addTimer(timer);
};

const addCommonTimer = (partial: Partial<TimerInterface>) => {
	addTimer(partialToInterface(partial));
}

const commonTimers: Partial<TimerInterface>[] = [
	{ issue: '34603', title: 'Cleanup call', },
	{ issue: '34511', title: 'Hotfix review', },
	{ issue: '35270', title: 'Senior dev', },
	{ issue: '36587', title: 'Zeus-web downtime', },
	{ issue: '36209', title: 'Company-wide meeting', },
	{ issue: '49022', title: 'EH Master Build Call', },
	{ issue: '80204', title: 'Encounter UI', },
	{ issue: '95143', title: 'Dev PTO 2021', },
];
</script>
<template>
	<ModalTemplate
		:modal-id="'quick-timer-modal'"
		:title="'Quick Timers'"
	>
	 	<h5>Common Timers</h5>
		<div
			v-for="timer, index in commonTimers"
			:key="index"
		>
			<button
				class="plain-btn"
				@click="addCommonTimer(timer)"
			>
				{{ timer.issue }} {{ timer.title }}
			</button>
		</div>
		<hr>
		<h5>Custom Timers</h5>
		<div id="custom-tickets-list">
			<div
				v-for="timer, index in TimerSystem.favorites()"
				:key="index"
			>
				<button
					class="plain-btn"
					@click="addTimer(timer)"
				>
					{{ timer.issue }} {{ timer.title }}
				</button>
				<button
					class="plain-btn"
					@click="TimerSystem.deleteFavorite(timer.issue)"
				>
					<i class="fa fa-trash-alt" />
				</button>
			</div>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>