<script setup lang="ts">
import AddTimer from '../modals/AddTimer.vue';
import { openModal } from '../data/ModalHandler';
import QuickTimers from '../modals/QuickTimers.vue';
import Help from '../modals/HelpText.vue';
import SettingsBar from '../modals/SettingsPage.vue';
import { Settings } from '../data/Settings';
import PageBody from './PageBody.vue';

const toggleDarkMode = () => {
	Settings.toggleDarkMode();
};

</script>
<template>
	<PageBody :dark-mode="Settings.darkMode" />
	<nav class="bg-default">
		<div class="d-flex justify-content-around align-items-center">
			<div id="left-controls">
				<i
					class="header-control fa fa-plus mt-button"
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
					class="fa fa-cog mt-button"
					@click="openModal(SettingsBar)"
				/>
				<i
					class="fa fa-ticket mt-button"
					@click="openModal(QuickTimers)"
				/>
				<i
					class="fa fa-question-circle mt-button"
					@click="openModal(Help)"
				/>
				<i
					class="fa fa-moon mt-button"
					@click="toggleDarkMode"
				/>
			</div>
		</div>
	</nav>
</template>
<style>
	.mt-button {
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 2px;
	}

	.mt-button:hover {
		background-color: rgba(0.0, 0.0, 0.0, 0.2);
	}
</style>