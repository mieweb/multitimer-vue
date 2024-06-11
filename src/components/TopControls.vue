<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { parse } from 'date-fns';
import AddTimer from '../modals/AddTimer.vue';
import ResetAllTimers from '../modals/ResetAllTimers.vue';
import RemoveAllTimers from '../modals/RemoveAllTimers.vue';
import QuickTimers from '../modals/QuickTimers.vue';
import Help from '../modals/HelpText.vue';
import SettingsBar from '../modals/SettingsPage.vue';
import { TimerFilter, TimerSystem } from '../data/TimerSystem';
import { openModal } from '../data/ModalHandler';
import { Settings } from '../data/Settings';
import { importMeetings } from '../data/ImportMeetings';
import ImportMeetings from '../modals/ImportMeetings.vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    console.log('isMenuOpen:', isMenuOpen.value);
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const menuElement = document.getElementById('menu');
    if (menuElement && !menuElement.contains(event.target as Node)) {
        isMenuOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const saveAllTimers = () => {
    // Implement the saveAllTimers function here
    console.log('Log All Timers clicked');
    closeMenu();
};

const updateLogDate = (event: Event) => {
    const dateString = (event.target as HTMLInputElement).value;
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    TimerSystem.setLogDate(date);
};

const filter: TimerFilter = reactive({
    search: '',
    withTime: false,
});

const updateFilter = () => TimerSystem.updateFilter(filter);
const withTimeOnClick = () => {
    filter.withTime = !filter.withTime;
    TimerSystem.updateFilter(filter);
};

const openSpecificModal = (modalComponent: any) => {
    openModal(modalComponent);
    closeMenu();
};

const toggleDarkMode = () => {
    Settings.toggleDarkMode();
    closeMenu();
};

const beginImport = async () => {
	openModal(ImportMeetings, { importMeetingData: await importMeetings() });
};
</script>

<template>
    <div class="container mt-5">
        <div class="row d-flex align-items-start">
            <div class="col-auto">
                <button class="primary" @click="() => openSpecificModal(AddTimer)">
                    <i class="header-control fa fa-plus p-0 pointer"></i> Add New
                </button>
            </div>
            <div class="col">
                <input
                    id="timer-search-box"
                    v-model="filter.search"
                    class="form-control"
                    type="text"
                    placeholder="Search Timers"
                    @input="updateFilter"
                >
                <div class="col-auto pt-1">
                    <div id="withTime" @click="withTimeOnClick">
                        <input
                            v-model="filter.withTime"
                            class="form-check-input"
                            name="has-time-check"
                            type="checkbox"
                        >
                        <label class="form-check-label" for="has-time-check">
                            &nbsp;Timers with time
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="overflow-wrapper" @click.stop>
                    <button id="overflow-button" class="secondary" @click="toggleMenu">
                        <i class="header-control fa fa-bars p-0 pointer"></i>
                    </button>
                    <div v-if="isMenuOpen" id="menu" class="menu" @mouseleave="closeMenu">
                        <ul>
                            <li @click="() => openSpecificModal(QuickTimers)">
                                <i class="fa fa-clock pointer"></i> Quick Timers
                            </li>
                            <li>
                                <a @click="() => TimerSystem.logAllTimers()">
                                    <i class="fa fa-clipboard-check pointer"></i> Log All Timers
                                </a>
                            </li>
                            <li @click="() => openSpecificModal(ResetAllTimers)">
                                <i class="fa fa-redo pointer"></i> Reset All Timers
                            </li>
                            <li @click="() => openSpecificModal(RemoveAllTimers)">
                                <i class="fa fa-trash pointer"></i> Delete All Timers
                            </li>
                            <li @click="() => openSpecificModal(SettingsBar)">
                                <i class="fa fa-cog pointer"></i> Settings
                            </li>
                            <li @click="() => openSpecificModal(Help)">
                                <i class="fa fa-question-circle pointer"></i> Help
                            </li>
                            <li @click="beginImport">
                                <i class="fa fa-windows pointer"></i> Get Meetings from Outlook
                            </li>
                            <li>
                                <a class="simple-link" href="https://github.mieweb.com/tbaugher/multitimer/issues" target="_blank" rel="noopener noreferrer">
                                    <i class="fa-solid fa-triangle-exclamation"></i> Report Issues
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#withTime, #withTime > * {
    user-select: none;
    cursor: pointer;
}
.overflow-wrapper {
    position: relative;
    display: inline-block;
  }
  
  .secondary {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .menu {
    position: absolute;
    display: block!important;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 250px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure the menu appears above other elements */
  }
  
  .menu ul {
    padding: 0;
    margin: 0;
  }
  
  .menu li {
    padding: 10px;
    cursor: pointer;
  }
  
  .menu li:hover {
    background: #f0f0f0;
  }
  
  .simple-link {
    text-decoration: none;
    color: inherit;
  }
</style>
