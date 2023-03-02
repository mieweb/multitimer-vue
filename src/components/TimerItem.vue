<script setup lang="ts">
import { billStatuses } from '../data/BillStatus';
import { TimerInterface, activities, getActivityValue } from '../data/TimerInterface';
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
    timerData: TimerInterface,
    isActive: boolean,
}>();
const billableSelect = ref<HTMLSelectElement>();
const activitySelect = ref<HTMLSelectElement>();
const commentField = ref<HTMLInputElement>();

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
	openModal(UpdateTime, { timerId: props.timerId });
};
const favorite = () => {
	try {
		TimerSystem.addFavoriteFromId(props.timerId);
	}
	catch {
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
	TimerSystem.editTimer(props.timerId, {
		billStatus: billableSelect?.value?.value
	});
};
const updateActivity = () => {
	TimerSystem.editTimer(props.timerId, {
		activity: activitySelect?.value?.value
	});
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
		class="timer py-3 px-4"
		:class="isActive ? 'bg-active' : 'bg-default'"
	>
		<div class="timer-grid">
			<i
				:class="`fa fa-save pointer save-button ${showOnHover} ${hideLog}`"
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
				class="title m-0"
				data-bs-toggle="tooltip"
				data-bs-title=""
			>
				{{ timerData.title }}
			</p>
			<p class="time m-0">
				{{ timerData.time }}
			</p>
			<div :class="`timer-options d-flex ${showOnHover}`">
				<i
					class="fa fa-edit pointer"
					@click="edit"
				/>
				<i
					class="fa fa-undo pointer"
					@click="reset"
				/>
				<i
					class="fa fa-plus pointer"
					@click="updateTime"
				/>
				<i
					class="fa fa-star pointer"
					@click="favorite"
				/>
				<i
					class="fa fa-trash-alt pointer"
					@click="remove"
				/>
			</div>
			<i
				class="fa pointer" 
				:class="isActive ? 'fa-pause' : 'fa-play'"
				@click="isActive ? pause() : start()"
			/>
			<i 
				:class="`fa control-toggle pointer ${chevron}`"
				@click="toggleControls"
			/>
			<div class="second-row">
				<div 
					:class="`selects ${showExtraControls}`"
				>
					<select 
						ref="billableSelect"
						:class="`form-select form-select-sm billable ${activeBgColor}`"
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
					<select
						ref="activitySelect"
						:class="`form-select form-select-sm activity ${activeBgColor}`"
						:value="getActivityValue(timerData.activity)"
						@change="updateBillStatus"
					>
						<option
							v-for="entry of activities"
							:key="entry.activity"
							:value="entry.value"
						> 
							{{ entry.activity }}
						</option>
					</select>
				</div>
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
			</div>
			<i 
				class="fa fa-grip-vertical handle"
			/>
		</div>
	</div>
</template>
<script lang="ts">
export default {};
</script>
<style lang="scss">
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
        grid-template-columns: min-content 54px 1fr 62px min-content min-content min-content;
        align-items: center;
        column-gap: 2rem;
        row-gap: 0.5rem;
        overflow-y: hidden; 
    }

    .save-button-grid {
        grid-column-start: 1;
    }

    .issue {
        grid-column-start: 2;
    }

	.second-row {
		grid-row-start: 2;
		display: flex;
		grid-column-start: 1;
		grid-column-end: 9;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: center;
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

	.selects {
		display:flex;
		grid-row-start: 2;
		grid-column-start: 1;
		grid-column-end: 3;
	}

    .billable,.activity {
        border-color: rgba(0, 0, 0, 0);
    }

    .comment {
        grid-row-start: 2;
        grid-column-start: 3;
        grid-column-end: 6;
        border-color: rgba(0, 0, 0, 0);
    }

    .link {
        grid-row-start: 2;
        grid-column-start: 6;
        grid-column-end: 9;
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
</style>