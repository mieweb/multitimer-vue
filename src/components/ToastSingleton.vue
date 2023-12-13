<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as bootstrap from 'bootstrap';

const toastTitleRef = ref<Element>();
const toastContentRef = ref<Element>();
let toast: bootstrap.Toast;
let headerClass = ref('');
let bodyClass = ref('');
let iconClass = ref('');

onMounted(() => {
	const toastEle = document.querySelectorAll('.toast')[0];
	toast = new bootstrap.Toast(toastEle, { animation: true });
});

document.addEventListener('showToast', (e: Event) => {
	const ce = e as CustomEvent;
	const { title, content, headerClass: header, bodyClass: body, icon } = ce.detail;

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	toastTitleRef.value!.textContent = title;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	toastContentRef.value!.textContent = content;
	headerClass.value = header;
	bodyClass.value = body;
	iconClass.value = icon;

	toast.show();
});
</script>
<template>
	<div class="toast-container position-fixed bottom-0 end-0 p-3">
		<div
			id="liveToast"
			class="toast"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div
				class="toast-header"
				:class="headerClass"
			>
				<i
					class="fa me-2"
					:class="iconClass"
				/>
				<strong
					ref="toastTitleRef"
					class="me-auto"
				/>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="toast"
					aria-label="Close"
				/>
			</div>
			<div
				ref="toastContentRef"
				class="toast-body"
				:class="bodyClass"
			/>
		</div>
	</div>
</template>
<script lang="ts">export default {};</script>
<style scoped>
</style>