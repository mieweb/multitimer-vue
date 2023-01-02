<script setup lang="ts">
import { TimerSystem } from '../data/TimerSystem';
</script>
<template>
	<div class="d-flex flex-column align-items-center pt-4 text-secondary">
		<h5>Total Time:</h5>
		<h4 id="total-time">
			{{ TimerSystem.totalTime() }}
		</h4>
	</div>
</template>
<script lang="ts">export default {};</script>