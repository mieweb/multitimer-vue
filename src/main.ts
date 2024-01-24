import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import * as ModalHandler from './data/ModalHandler';
import { initSaveSystem }  from './data/SaveSystem';
import * as Hotkeys from './data/Hotkeys';

setup();

async function setup() {
	await initSaveSystem();
	createApp(App).mount('#app');
	ModalHandler.init();
	Hotkeys.init();
}
