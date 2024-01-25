import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import * as ModalHandler from './data/ModalHandler';
import { initSecureSaveSystem, initSaveSystem }  from './data/SaveSystem';
import * as Hotkeys from './data/Hotkeys';
import { initFirestore } from './data/SaveInterface';

setup();

async function setup() {
	await initFirestore();
	await initSecureSaveSystem();
	const app = createApp(App);
	app.provide('saveSystem', 'firebase');
	app.mount('#app');
	ModalHandler.init();
	Hotkeys.init();
}
