import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import * as ModalHandler from './data/ModalHandler';
import * as Save from './data/Save';

const saveSystem = Save.getStorage();
window.onbeforeunload = saveSystem.save;
window.onload = saveSystem.load;
createApp(App).mount('#app');
ModalHandler.init();