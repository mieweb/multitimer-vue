<script setup lang="ts">
import { inject } from 'vue';
import { getSaveSystem } from '../data/SaveSystem';
import { getFirebase } from '../data/SaveInterface';

const providedSaveSystem = inject('saveSystem');
const saveSystem = getSaveSystem();

const attemptSignIn = async (event: Event) => {
	const submitEvent = event as SubmitEvent;
	const formElement = submitEvent.target as HTMLFormElement;
	const formData = new FormData(formElement);
	const email = (formData.get('email') ?? '') as string;
	const password = (formData.get('password') ?? '') as string;
	const firebase = await getFirebase(email, password);

	saveSystem.setSaveSystem(firebase);
};
</script>
<template>
	<div id="sign-in-centering" class="d-flex align-items-center justify-content-center flex-column">
		<h3 class="mb-3">MultiTimer Sign In</h3>
		<form @submit.stop.prevent="attemptSignIn">
			<div class="mb-3">
				<label for="email" class="form-label">Email:</label>
				<input name="email" type="email" class="form-control" >
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password:</label>
				<input name="password" type="password" class="form-control" >
			</div>
				<input class="btn btn-primary" type="submit" value="Sign In">
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
