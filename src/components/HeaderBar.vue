<script setup lang="ts">
import AddTimer from '../modals/AddTimer.vue';
import { openModal } from '../data/ModalHandler';
import QuickTimers from '../modals/QuickTimers.vue';
import Help from '../modals/HelpText.vue';
import SettingsBar from '../modals/SettingsPage.vue';

const toggleDarkMode = () => {
	const bodyClassList = document.querySelector('body')?.classList;
	if (!bodyClassList) return;

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
				/>
			</div>
			<div id="mid-controls">
				<h3 class="my-2 align-middle">
					MIE MultiTimer
				</h3>
			</div>
			<div
				id="right-controls"
				class="d-flex gap-1"
			>
				<i
					class="fa fa-cog pointer"
					@click="openModal(SettingsBar)"
				/>
				<i
					class="fa fa-ticket pointer"
					@click="openModal(QuickTimers)"
				/>
				<i
					class="fa fa-question-circle pointer"
					@click="openModal(Help)"
				/>
				<i
					class="fa fa-moon pointer"
					@click="toggleDarkMode"
				/>
			</div>
		</div>
	</nav>
</template>