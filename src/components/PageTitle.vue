<script setup lang="ts">
import { watch } from 'vue';
import HMS from '../data/HMS';

const props = defineProps<{
    time: HMS
}>();

const titleBase = 'MultiTimer';
const titleElement = document.querySelector('title');
if (titleElement) {
	watch(props, async(props) => {
		titleElement.innerText = `${titleBase} [${props.time.toString()}]`;
	});
}
</script>
<template><div /></template>