<script setup lang="ts">
import { billStatuses } from '../data/BillStatus';
import TimerInterface from '../data/TimerInterface';
import { TimerSystem } from '../data/TimerSystem';
import { ref } from 'vue';
import { openModal } from '../data/ModalHandler';
import DeleteTimer from '../modals/DeleteTimer.vue';
import EditTimer from '../modals/EditTimer.vue';
import ResetTimer from '../modals/ResetTimer.vue';
import UpdateTime from '../modals/UpdateTime.vue';
import { Settings } from '../data/Settings';
const props = defineProps<{
    timerId: number,
    timerData: TimerInterface,
    isActive: boolean,
}>();
const Timer = {
    log: () => {
        TimerSystem.timerToConfirm = props.timerId;
        TimerSystem.logTimer();
    },
    start: () => {
        TimerSystem.timerToConfirm = props.timerId;
        TimerSystem.startTimer();
    },
    pause: () => {
        TimerSystem.pauseActiveTimer();
    },
    delete: () => {
        TimerSystem.timerToConfirm = props.timerId;
        openModal(DeleteTimer);
    },
    edit: () => {
        TimerSystem.timerToConfirm = props.timerId;
        openModal(EditTimer)
    },
    reset: () => {
        TimerSystem.timerToConfirm = props.timerId;
        openModal(ResetTimer)
    },
    updateTime: () => {
        TimerSystem.timerToConfirm = props.timerId;
        openModal(UpdateTime)
    },
    favorite: () => {
        TimerSystem.timerToConfirm = props.timerId;
        TimerSystem.addFavorite();
    },
    toggleControls: () => {
        TimerSystem.timerToConfirm = props.timerId;
        TimerSystem.toggleControls();
    }
};
const IsModalOpen = {
    add: false,
    delete: false,
    edit: false
};
const ExtraControlsClass = {
    visibility: (visible: boolean) => visible ? 'd-none' : '',
    bgAlt: (isActive: boolean) => isActive ? 'bg-alt-active' : 'bg-alt-default'
};
</script>
<template>
    <div class="timer py-3 px-4" :class="isActive ? 'bg-active' : 'bg-default'">
        <div class="timer-grid">
            <i :class="`fa fa-save pointer save-button ${Settings.hideOptions ? 'hover-hide' : ''}`" @click="Timer.log"></i>
            <p class="issue m-0 pointer">{{ timerData.issue }}</p>
            <p class="title m-0" data-bs-toggle="tooltip" data-bs-title="">{{timerData.title}}</p>
            <p class="time m-0">{{timerData.time}}</p>
            <div :class="`timer-options d-flex ${Settings.hideOptions ? 'hover-hide' : ''}`">
                <i
                    class="fa fa-edit pointer"
                    @click="Timer.edit"
                ></i>
                <i
                    class="fa fa-undo pointer"
                    @click="Timer.reset"
                ></i>
                <i
                    class="fa fa-plus pointer"
                    @click="Timer.updateTime"
                ></i>
                <i
                    class="fa fa-star pointer"
                    @click="Timer.favorite"
                ></i>
                <i
                    class="fa fa-trash-alt pointer"
                    @click="Timer.delete"
                ></i>
            </div>
            <i class="fa pointer" 
                :class="isActive ? 'fa-pause' : 'fa-play'"
                @click="isActive ? Timer.pause() : Timer.start()"
            ></i>
            <i 
                :class="'fa control-toggle pointer ' + (timerData.controlsHidden ? 'fa-chevron-down' : 'fa-chevron-up')"
                @click="Timer.toggleControls"
            ></i>
            <select 
                :class="`form-select form-select-sm billable  ${ExtraControlsClass.bgAlt(isActive)} ${ExtraControlsClass.visibility(timerData.controlsHidden)}`"
            >
                <option v-for="status in billStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
            <input
                type="text"
                :class="`form-control form-control-sm comment ${ExtraControlsClass.bgAlt(isActive)} ${ExtraControlsClass.visibility(timerData.controlsHidden)}`"
                placeholder="Comment..."
                :value="timerData.comment"
            />
            <a 
                target="_blank" 
                rel="noopener noreferrer" 
                :href="timerData.link" 
                :class="`link btn btn-sm ${ExtraControlsClass.bgAlt(isActive)} ${ExtraControlsClass.visibility(timerData.controlsHidden)}`"
            >
                Meeting Link
            </a>
        </div>
    </div>
</template>
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

    .billable {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: 3;
        border-color: rgba(0, 0, 0, 0);
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
</style>
<script lang="ts">
    export default {};
</script>