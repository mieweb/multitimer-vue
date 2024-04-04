<script setup lang="ts">
import { Ref, ref } from 'vue';

const error: Ref<string | null> = ref(null);
const signInForm = ref<HTMLFormElement>();

const attemptRegister = async (event: Event) => {
	const formData = new FormData(signInForm.value);
	const username = (formData.get('username') ?? '') as string;
	const password = (formData.get('password') ?? '') as string;

	// register code here...
};

const attemptSignIn = async (event: Event) => {
	const formData = new FormData(signInForm.value);
	const username = (formData.get('username') ?? '') as string;
	const password = (formData.get('password') ?? '') as string;

	// sign in code here...
};
</script>
<template>
	<div
		id="sign-in-centering"
		class="d-flex align-items-center justify-content-center flex-column"
	>
		<h3 class="mb-3">
			MultiTimer Sign In
		</h3>
		<form 
			ref="signInForm" 
			@submit.stop.prevent=""
		>
			<div class="mb-3">
				<label 
					for="email" 
					class="form-label"
				>
					Email:
				</label>
				<input
					name="email"
					type="email"
					class="form-control"
				>
			</div>
			<div class="mb-3">
				<label
					for="password"
					class="form-label"
				>Password:</label>
				<input
					name="password"
					type="password"
					class="form-control"
				>
			</div>
			<button
				class="btn btn-primary me-2"
				@click="attemptRegister"
			>
				Register
			</button>
			<button
				class="btn btn-outline-primary"
				@click="attemptSignIn"
			>
				Sign In
			</button>

			<div
				v-if="error !== null"
				class="alert alert-danger mt-3"
			>
				{{ error }}
			</div>
		</form>
	</div>
</template>
<script lang="ts">export default {};
</script>
<style>
	#sign-in-centering {
		height: 100vh;
	}
</style>
