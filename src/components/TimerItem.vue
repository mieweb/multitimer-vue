<script setup lang="ts">
import { Activity, TimerData, activities, isBillStatus, billStatuses } from '../data/TimerData';
import { TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import RemoveTimer from '../modals/RemoveTimer.vue';
import EditTimer from '../modals/EditTimer.vue';
import ResetTimer from '../modals/ResetTimer.vue';
import UpdateTime from '../modals/UpdateTime.vue';
import { Settings } from '../data/Settings';
//@ts-expect-error: No typing on this, @types/animejs doesn't work (?);
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
const hideLog = computed(() => TimerSystem.isLoggable(props.timerData) ? '' : 'hide');
const chevron = computed(() => props.timerData.controlsHidden ? 'fa-chevron-down' : 'fa-chevron-up');
const showExtraControls = computed(() => props.timerData.controlsHidden ? 'd-none' : '');
const activeBgColor = computed(() => props.isActive ? 'bg-alt-active' : 'bg-alt-default');
const issueLink = computed(() => `https://pm.mieweb.com/issues/${props.timerData.issue}`);

</script>
<template>
    <div class="timer container row d-flex m-0" :class="isActive ? 'bg-active' : 'bg-default'" @click="interactTimer">
        <div class="col-1 d-flex justify-content-center pt-3">
			<i
				class="fa timer-button" 
				:class="isActive ? 'fa-pause' : 'fa-play'"
				@click="isActive ? pause() : start()"
			/>
        </div>
        <div class="col w-100">
            <div class="d-flex row">
                <div class="col-8">
                    <div class="row">
                        <h6 class="title m-0">{{ timerData.title }}</h6>
                        <span class="issue-number">Issue # <span class="issue m-0 pointer">{{ timerData.issue }}</span></span>
                    </div>
                </div>
                <div class="d-flex col-4 justify-content-end">
                    <div class="d-flex row">
                        <div class="col">
                            <div class="timer-options">
                                <i
                                :class="`fa fa-save save-button timer-button ${showOnHover} ${hideLog}`"
                                @click="log"
                                />
                                <i
                                    :class="`fa fa-edit timer-button ${showOnHover}`"
                                    @click="edit"
                                />
                                <i
                                    :class="`fa fa-undo timer-button ${showOnHover}`"
                                    @click="reset"
                                />
                                <i
                                    :class="`fa fa-plus timer-button ${showOnHover}`"
                                    @click="updateTime"
                                />
                                <i
                                    ref="favoriteStar"
                                    :class="`fa fa-star timer-button ${showOnHover}`"
                                    @click="favorite"
                                />
                                <i
                                    :class="`fa fa-trash-alt timer-button ${showOnHover}`"
                                    @click="remove"
                                />
                            </div>
                        </div>
                        <div class="col d-flex">
                            <span class="time m-0 me-2 mt-1">{{ timerData.time }}</span>
                            <i 
                                :class="`fa control-toggle timer-button ${chevron}`"
                                @click="toggleControls"
                            />  
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="d-flex mt-2 mb-1 gap-2">
                    <div class="d-flex col-3">
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
                    </div>
                    <div class="col-7">
                        <input
                            ref="commentField"
                            type="text"
                            :class="`form-control form-control-sm comment ${activeBgColor} ${showExtraControls}`"
                            placeholder="Comment..."
                            :value="timerData.comment"
                            @input="updateComment"
                        >
                    </div>
                    <div class="col-2">
                        <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            :href="timerData.link" 
                            :class="`link btn btn-sm ${activeBgColor} ${showExtraControls}`"
                        >
                            Meeting Link
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {};
</script>