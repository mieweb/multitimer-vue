<script setup lang="ts">
import { TimerSystem } from '../data/TimerSystem';
</script>
<template>
	<div
		id="total-time"
		class="d-flex flex-column align-items-center pt-4 text-secondary"
	>
		<h5>Total Time:</h5>
		<h4>
			{{ TimerSystem.totalTime() }}
		</h4>
	</div>
</template>
<script lang="ts">export default {};</script>
<style>
#total-time * {
	color: var(--foreground-alt) !important;
}
</style>