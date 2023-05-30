<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
import { TimerSystem, TimerEntry } from '../data/TimerSystem';
import { FavoriteTimer } from '../data/TimerData';
//@ts-expect-error: No typing on this, @types/animejs doesn't work (?)
import anime from 'animejs/lib/anime.es';

const addTimer = (event: MouseEvent, timer: FavoriteTimer) => {
	if (!TimerSystem.addFavoriteToTimerList(timer)) {
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
const addDeletedTimer = (event: MouseEvent, timer: TimerEntry) => {
	if (!TimerSystem.addDeletedToTimerList(timer)) {
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

const commonTimers: FavoriteTimer[] = [
	{ issue: '34603', title: 'Cleanup call', link: '', billStatus: 'Non-Billable', activity: 'Meeting' },
	{ issue: '34511', title: 'Hotfix review', link: '', billStatus: 'Non-Billable', activity: 'Meeting' },
	{ issue: '35270', title: 'Senior dev', link: '', billStatus: 'Non-Billable', activity: 'Meeting' },
	{ issue: '36587', title: 'Zeus-web downtime', link: '', billStatus: 'Non-Billable', activity: 'Other' },
	{ issue: '36209', title: 'Company-wide meeting', link: '', billStatus: 'Non-Billable', activity: 'Meeting' },
	{ issue: '49022', title: 'EH Master Build Call', link: '', billStatus: 'Non-Billable', activity: 'Meeting' },
	{ issue: '80204', title: 'Encounter UI', link: '', billStatus: 'Non-Billable', activity: 'Other' },
	{ issue: '95143', title: 'Dev PTO 2021', link: '', billStatus: 'Non-Billable', activity: 'Other'},
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
				@click="(e: MouseEvent) => addTimer(e, timer)"
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
					@click="(e: MouseEvent) => addTimer(e, timer)"
				>
					{{ timer.issue }} {{ timer.title }}
				</button>
				<button
					class="plain-btn quick-timer-delete"
					@click="TimerSystem.removeFavorite(timer.issue)"
				>
					<i class="fa fa-trash-alt" />
				</button>
			</div>
		</div>
		<hr>
		<h5>Recently Deleted Timers</h5>
		<div>
			<div
				v-for="deletedTimerEntry, index in TimerSystem.getDeletedTimers()"
				:key="index"
			>
				<button
					class="plain-btn"
					@click="(e: MouseEvent) => addDeletedTimer(e, deletedTimerEntry)"
				>
					{{ deletedTimerEntry.timer.issue }} {{ deletedTimerEntry.timer.title }}
				</button>
			</div>
		</div>
	</ModalTemplate>
</template>
<script lang="ts">export default {};</script>

<style>
	.quick-timer-delete {
		filter: hue-rotate(90deg);
	}
</style>