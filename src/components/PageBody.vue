<script setup lang="ts">
import { watch } from 'vue';
const props = defineProps<{
    darkMode: boolean
}>();

const bodyClassList = document.querySelector('body')?.classList;
if (bodyClassList) {
	watch(props, async ({ darkMode }) => {
		if (darkMode) {
			bodyClassList.add('dark');
		} else {
			bodyClassList.remove('dark');
		}
	});
}
</script>