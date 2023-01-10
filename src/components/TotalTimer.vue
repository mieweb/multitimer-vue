<script setup lang="ts">
import { computed } from 'vue';
import { TimerSystem } from '../data/TimerSystem';
import PageTitle from './PageTitle.vue';

const totalTime = computed(() => TimerSystem.totalTime());
</script>
<template>
	<PageTitle :time="totalTime" />
	<div
		id="total-time"
		class="d-flex flex-column align-items-center pt-4 text-secondary"
	>
		<h5>Total Time:</h5>
		<h4>
			{{ totalTime }}
		</h4>
	</div>
</template>
<script lang="ts">export default {};</script>
<style>
#total-time * {
	color: var(--foreground-alt) !important;
}
</style>