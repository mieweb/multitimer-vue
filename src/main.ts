import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import * as ModalHandler from './data/ModalHandler';
import * as SaveNotifier from './data/SaveSystem';
import * as Hotkeys from './data/Hotkeys';
import { Settings } from './data/Settings';

const saveNotifer = SaveNotifier.getSaveNotifier();
createApp(App).mount('#app');
ModalHandler.init();
Hotkeys.init();