import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import * as ModalHandler from './data/ModalHandler';
import * as Save from './data/Save';
import * as Hotkeys from './data/Hotkeys';
import { Settings } from './data/Settings';

const saveSystem = Save.getStorage();
window.onbeforeunload = saveSystem.save;
window.onload = saveSystem.load;
saveSystem.setAutosaveInterval(Settings.autosaveInterval);
createApp(App).mount('#app');
ModalHandler.init();
Hotkeys.init();