<script setup lang="ts">
import AddTimer from '../modals/AddTimer.vue';
import { openModal } from '../data/ModalHandler';
import { Modal } from 'bootstrap';
import QuickTimers from '../modals/QuickTimers.vue';
import Help from '../modals/Help.vue';
import Settings from '../modals/Settings.vue';

const toggleDarkMode = () => {
    const bodyClassList = document.querySelector('body')?.classList!;
    if (bodyClassList.contains('dark')) {
        bodyClassList.remove('dark');
    } else {
        bodyClassList.add('dark');
    }
};

</script>
<template>
    <nav class="bg-default">
        <div class="d-flex justify-content-around align-items-center">
            <div id="left-controls">
                <i
                    class="header-control fa fa-plus p-0 pointer"
                    @click="openModal(AddTimer)"
                ></i>
            </div>
            <div id="mid-controls">
                <h3 class="my-2">MIE MultiTimer</h3>
            </div>
            <div id="right-controls">
                <i
                    class="fa fa-cog pointer"
                    @click="openModal(Settings)"
                ></i>
                <i
                    class="fa fa-ticket pointer"
                    @click="openModal(QuickTimers)"
                ></i>
                <i
                    class="fa fa-question-circle pointer"
                    @click="openModal(Help)"
                ></i>
                <i
                    class="fa fa-moon pointer"
                    @click="toggleDarkMode"
                ></i>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
export default {};
</script>