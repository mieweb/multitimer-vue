import AddTimerVue from '../modals/AddTimer.vue';
import { openModal } from './ModalHandler';

// type HotkeyFunctionMap = { [index: string]: () => void };

export function init() {
	document.addEventListener('keypress', (e: KeyboardEvent) => {
		switch (e.key) {
		case '+':
			if (document.activeElement instanceof HTMLInputElement) break;
			openModal(AddTimerVue);
			break;
		}
	});
}