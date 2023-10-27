<script setup lang="ts">
import { TimerData} from '../data/TimerData';
import { TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import RemoveTimer from '../modals/RemoveTimer.vue';
import MobileTimerDetails from '../modals/MobileTimerDetails.vue';
import { computed } from 'vue';
//@ts-expect-error: No typing on this, @types/animejs doesn't work (?)
import anime from 'animejs/lib/anime.es';

const props = defineProps<{
    timerId: number,
    timerData: TimerData,
    isActive: boolean,
}>();

const issueLink = computed(() => `https://pm.mieweb.com/issues/${props.timerData.issue}`);
const hideLog = computed(() => TimerSystem.isLoggable(props.timerData) ? '' : 'd-none');

const edit = () => {
	openModal(MobileTimerDetails, {
		timerId: props.timerId,
		timerData: {
			title: props.timerData.title,
			issue: props.timerData.issue,
			link: props.timerData.link,
			activity: props.timerData.activity,
			billStatus: props.timerData.billStatus
		}
	});
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
	}
	catch {
		return;
	}
};
const remove = () => openModal(RemoveTimer, { timerId: props.timerId });
const activeTimerBgColor = computed(() => props.isActive ? 'bg-alt-active' : 'bg-alt-default');
</script>

<template>
	<div
		class="timer p-2"
		:class="isActive ? 'bg-active' : 'bg-default'"
		@click="isActive ? TimerSystem.pauseActiveTimer() : TimerSystem.startTimer(timerId)"
	>
		<div class="timer-grid">
			<span class="preview-data">
				<div class="title">{{ timerData.title }}</div>
				<div>{{ timerData.time.toString() }}</div>
			</span>
			<span
				class="dropdown"
			>
				<button
					class="float-end options btn dropdown-toggle"
					:class="`${activeTimerBgColor}`"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					@click.stop=""
				>
					Options
				</button>
				<ul
					class="dropdown-menu mobile-dropdown"
				>
					<li>
						<button
							class="dropdown-item"
							@click.stop="edit"
						>
							Edit
						</button>
					</li>
					<li>
						<button
							class="dropdown-item"
							:class="hideLog"
							@click.stop="TimerSystem.logTimer(timerId)"
						>Log Timer</button>
					</li>
					<li>
						<button
							class="dropdown-item"
							@click.stop="favorite"
						>
							Favorite Timer
						</button>
					</li>
					<li>
						<a
							class="dropdown-item"
							:href="issueLink"
							target="_blank"
							rel="noreferrer noopener"
							@click.stop
						>
							Open Issue <i class=" fa fa-arrow-up-right-from-square" />
						</a>
					</li>
					<li>
						<button
							class="dropdown-item"
							@click.stop="remove"
						>
							Remove
						</button>
					</li>
				</ul>
			</span>
		</div>
	</div>
</template>
<script lang="ts">
export default {};
</script>
<style lang="scss" scoped>
	.timer .dropdown-toggle:hover {
		all: unset;
	}

	.options {
		border-color: rgba(0, 0, 0, 0);
	}

	$dropdown-bg: var(--background-alt);
	.button-list {
		display: flex;
		grid-column: 2 3;
		gap: 0.2rem;
	}

	.preview-data {
		grid-column: 1 2;
	}

	.timer-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 1fr;
        align-items: center;
        column-gap: 1rem;
        row-gap: 0.5rem;
	}

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

	.mobile-dropdown {
		background: var(--background);
	}
</style>