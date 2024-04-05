<script setup lang="ts">
import { Ref, ref } from 'vue';
import { registerMongoSystem, signInMongoSystem } from '../data/SaveInterface';
import { getSaveSystem, SaveSystem } from '../data/SaveSystem';
import { Settings } from '../data/Settings';

const error: Ref<string | null> = ref(null);
const signInForm = ref<HTMLFormElement>();
const saveSystem = getSaveSystem();

const attemptRegister = async (event: Event) => {
	const formData = new FormData(signInForm.value);
	const username = (formData.get('username') ?? '') as string;
	const password = (formData.get('password') ?? '') as string;

	try {
		const saveInterface = await registerMongoSystem(username, password);

		saveSystem.value = new SaveSystem(saveInterface, Settings.autosaveInterval);
	} catch (e) {
		error.value = (<Error>e).message;
	}
};

const attemptSignIn = async (event: Event) => {
	const formData = new FormData(signInForm.value);
	const username = (formData.get('username') ?? '') as string;
	const password = (formData.get('password') ?? '') as string;

	try {
		const saveInterface = await signInMongoSystem(username, password);

		saveSystem.value = new SaveSystem(saveInterface, Settings.autosaveInterval);
	} catch (e) {
		error.value = (<Error>e).message;
	}
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
					for="username" 
					class="form-label"
				>
					Username:
				</label>
				<input
					name="username"
					type="text"
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
