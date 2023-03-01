<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem } from '../data/TimerSystem';
import { partialToInterface, TimerInterface } from '../data/TimerInterface';
//@ts-expect-error: No typing on this, @types/animejs doesn't work (?)
import anime from 'animejs/lib/anime.es';

const addTimer = (event: MouseEvent, timer: TimerInterface) => {
	if (!TimerSystem.addTimer(partialToInterface(timer))) {
		const animatedElement = (event.target as Element).parentElement;
		anime({
			targets: animatedElement,
			keyframes: [
				{ value: 30, translate: '0.3rem' },
				{ value: 60, translate: '-0.2rem' },
				{ value: 90, translate: '0.1rem' },
				{ value: 100, translate: '0.0rem'}
			],
			duration: 250,
			easing: 'linear'
		});
	}
};

const addCommonTimer = (event: MouseEvent, partial: Partial<TimerInterface>) => {
	addTimer(event, partialToInterface(partial));
};

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
				@click="e => addCommonTimer(e, timer)"
			>
				{{ timer.issue }} {{ timer.title }}
			</button>
		</div>
		<hr>
		<h5>Favorite Timers</h5>
		<div>
			<div
				v-for="timer, index in TimerSystem.favorites()"
				:key="index"
			>
				<button
					class="plain-btn"
					@click="e => addTimer(e, timer)"
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