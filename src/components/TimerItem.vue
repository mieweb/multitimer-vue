<script setup lang="ts">
import { Activity, TimerData, activities, isBillStatus, billStatuses } from '../data/TimerData';
import { TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import RemoveTimer from '../modals/RemoveTimer.vue';
import EditTimer from '../modals/EditTimer.vue';
import ResetTimer from '../modals/ResetTimer.vue';
import UpdateTime from '../modals/UpdateTime.vue';
import { Settings } from '../data/Settings';
//@ts-expect-error: No typing on this, @types/animejs doesn't work (?)
import anime from 'animejs/lib/anime.es';
import { computed, ref } from 'vue';
const props = defineProps<{
    timerId: number,
    timerData: TimerData,
    isActive: boolean,
}>();

const timerContainer = ref<Element>();
const timerGrid = ref<Element>();
const title = ref<Element>();
const time = ref<Element>();
const favoriteStar = ref<Element>();

const billableSelect = ref<HTMLSelectElement>();
const activitySelect = ref<HTMLSelectElement>();
const commentField = ref<HTMLInputElement>();
const activitySelected = ref(false);

const log = () => {
	TimerSystem.logTimer(props.timerId);
};
const start = () => {
	TimerSystem.startTimer(props.timerId);
};
const pause = () => {
	TimerSystem.pauseActiveTimer();
};
const remove = () => {
	openModal(RemoveTimer, { timerId: props.timerId });
};
const edit = () => {
	openModal(EditTimer, { timerId: props.timerId, timerData: props.timerData });
};
const reset = () => {
	openModal(ResetTimer, { timerId: props.timerId });
};
const updateTime = () => {
	openModal(UpdateTime, { timerId: props.timerId, timerData: { time: props.timerData.time }});
};
const favorite = () => {
	try {
		TimerSystem.createFavoriteFromId(props.timerId);
		anime({
			targets: '.fa-ticket',
			keyframes: [
				{ value: 20, rotate: '-30deg' },
				{ value: 40, rotate: '25deg' },
				{ value: 60, rotate: '-15deg' },
				{ value: 80, rotate: '5deg' },
				{ value: 100, rotate: '0deg' }
			],
			duration: 1000,
			easing: 'easeInOutSine'
		});
		anime({
			targets: favoriteStar.value,
			rotate: '1turn',
			duration: 1000,
			easing: 'easeOutElastic'
		});
	}
	catch {
		anime({
			targets: favoriteStar.value,
			keyframes: [
				{ value: 30, translate: '0.3rem' },
				{ value: 60, translate: '-0.2rem' },
				{ value: 90, translate: '0.1rem' },
				{ value: 100, translate: '0.0rem'}
			],
			duration: 250,
			easing: 'linear'
		});
		return;
	}
};
const toggleControls = () => {
	TimerSystem.toggleControls(props.timerId);
};
const updateComment = () => {
	TimerSystem.editTimer(props.timerId, {
		comment: commentField?.value?.value
	});
};
const updateBillStatus = () => {
	const billStatus = billableSelect?.value?.value;
	if (!billStatus || !isBillStatus(billStatus)) return;

	TimerSystem.editTimer(props.timerId, {
		billStatus
	});
};
const updateActivity = () => {
	const activity = activitySelect?.value?.value as Activity;
	TimerSystem.editTimer(props.timerId, {
		activity
	});
};
const toggleDropdown = () => {
	activitySelected.value = !activitySelected.value;
};
const interactTimer = (event: Event) => {
	const validTargets = [
		timerGrid.value,
		timerContainer.value,
		title.value,
		time.value
	] as Element[];
	if (!Settings.startOnTimerClick) return;
	if (!event.target) return;
	if (!validTargets.includes(event.target as Element)) return;

	if (props.isActive)
		TimerSystem.pauseActiveTimer();
	else 
		TimerSystem.startTimer(props.timerId);

};

const showOnHover = computed(() => Settings.hideOptions ? 'hover-hide' : '');
const hideLog = computed(() => !props.timerData.issue ? 'hide' : '');
const chevron = computed(() => props.timerData.controlsHidden ? 'fa-chevron-down' : 'fa-chevron-up');
const showExtraControls = computed(() => props.timerData.controlsHidden ? 'd-none' : '');
const activeBgColor = computed(() => props.isActive ? 'bg-alt-active' : 'bg-alt-default');
const issueLink = computed(() => `https://pm.mieweb.com/issues/${props.timerData.issue}`);

</script>
<template>
	<div
		ref="timerContainer"
		class="timer py-2 px-3"
		:class="isActive ? 'bg-active' : 'bg-default'"
		@click="interactTimer"
	>
		<div
			ref="timerGrid"
			class="timer-grid"
		>
			<i
				:class="`fa fa-save save-button timer-button ${showOnHover} ${hideLog}`"
				@click="log"
			/>
			<a 
				:href="issueLink"
				target="_blank"
				rel="noreferrer noopener"
				class="issue m-0 pointer simple-link"
			>
				{{ timerData.issue }}
			</a>
			<p
				ref="title"
				class="title m-0"
				data-bs-toggle="tooltip"
				data-bs-title=""
			>
				{{ timerData.title }}
			</p>
			<p
				ref="time"
				class="time m-0"
			>
				{{ timerData.time }}
			</p>
			<div :class="`timer-options d-flex ${showOnHover}`">
				<i
					class="fa fa-edit timer-button"
					@click="edit"
				/>
				<i
					class="fa fa-undo timer-button"
					@click="reset"
				/>
				<i
					class="fa fa-plus timer-button"
					@click="updateTime"
				/>
				<i
					ref="favoriteStar"
					class="fa fa-star timer-button"
					@click="favorite"
				/>
				<i
					class="fa fa-trash-alt timer-button"
					@click="remove"
				/>
			</div>
			<i
				class="fa timer-button" 
				:class="isActive ? 'fa-pause' : 'fa-play'"
				@click="isActive ? pause() : start()"
			/>
			<i 
				:class="`fa control-toggle timer-button ${chevron}`"
				@click="toggleControls"
			/>
			<i
				id="toggle-dropdown"
				:class="`fa fa-retweet timer-button ${showExtraControls}`"
				@click="toggleDropdown"
			/>
			<select
				v-if="activitySelected"
				ref="activitySelect"
				:class="`form-select form-select-sm activity ${activeBgColor} ${showExtraControls}`"
				:value="timerData.activity"
				@change="updateActivity"
			>
				<option
					v-for="entry of activities"
					:key="entry.activity"
				> 
					{{ entry.activity }}
				</option>
			</select>
			<select 
				v-else
				ref="billableSelect"
				:class="`form-select form-select-sm billable ${activeBgColor} ${showExtraControls}`"
				:value="timerData.billStatus"
				@change="updateBillStatus"
			>
				<option
					v-for="status in billStatuses"
					:key="status"
					:value="status"
				>
					{{ status }}
				</option>
			</select>
			<input
				ref="commentField"
				type="text"
				:class="`form-control form-control-sm comment ${activeBgColor} ${showExtraControls}`"
				placeholder="Comment..."
				:value="timerData.comment"
				@input="updateComment"
			>
			<a 
				target="_blank" 
				rel="noopener noreferrer" 
				:href="timerData.link" 
				:class="`link btn btn-sm ${activeBgColor} ${showExtraControls}`"
			>
				Meeting Link
			</a>
			<i 
				class="fa fa-grip-vertical handle"
			/>
		</div>
	</div>
</template>
<script lang="ts">
export default {};
</script>
<style lang="scss" scoped>
    .timer {
        border-radius: 0.2rem;
        width: 100%;
    }

    .timer * {
        color: var(--foreground);
    }

    .timer input:focus {
        background-color: var(--background-alt);
        color: var(--foreground);
        border-color: var(--background-alt);
    }

    .timer:hover .hover-hide {
        visibility: visible;
    }

    .timer-grid {
        display: grid;
        grid-template-columns: min-content 90px 1fr 62px min-content min-content min-content;
        align-items: center;
        column-gap: 2rem;
        row-gap: 0.5rem;
        overflow-y: hidden; 
    }

    .save-button {
        grid-column-start: 1;
		text-align: center;
    }

    .issue {
        grid-column-start: 2;
		padding: 0.25rem;
		text-align: center;
    }

    .title {
        grid-column-start: 3;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .time {
        grid-column-start: 4;
    }

    .timer-options {
        grid-column-start: 5;
        gap: 0.4rem;
    }

    .time-control {
        grid-column-start: 6;
    }

    .billable,.activity {
        border-color: rgba(0, 0, 0, 0);
    }

	.activity {
		grid-row-start: 2;
		grid-column-start: 2;
		grid-column-end: 3;
	}

	.billable {
		grid-row-start: 2;
		grid-column-start: 2;
		grid-column-end: 3;
	}

    .comment {
        grid-row-start: 2;
        grid-column-start: 3;
        grid-column-end: 5;
        border-color: rgba(0, 0, 0, 0);
    }

	.comment::placeholder {
		color: var(--foreground-alt);
	}

    .link {
        grid-row-start: 2;
        grid-column-start: 5;
        grid-column-end: 8;
        transition: none !important;
    }

    .control-toggle {
        grid-row-start: 1;
        grid-column-start: 7;
    }

	.handle {
		grid-column-start: 8;
		cursor: grab;
	}

	#toggle-dropdown {
		grid-row-start: 2;
		grid-column-start: 1;
		grid-column-end: 2;
	}

	.timer-button {
		padding: 0.25rem;
		cursor: pointer;
		border-radius: 2px;
	}

	.timer-button:hover {
		background-color: rgba(0.0, 0.0, 0.0, 0.2);
	}
</style>