import AddTimerVue from '../modals/AddTimer.vue';
import { openModal } from './ModalHandler';

// type HotkeyFunctionMap = { [index: string]: () => void };

export function init() {
	document.addEventListener('keyup', (e: KeyboardEvent) => {
		let searchBox = null;
		switch (e.key) {
		case '+':
			if (document.activeElement instanceof HTMLInputElement) break;
			openModal(AddTimerVue);
			break;
		case 's':
			if (document.activeElement instanceof HTMLInputElement) break;
			searchBox = document.querySelector('#timer-search-box') as HTMLInputElement;
			if (!searchBox) break;
			searchBox.focus();
			break;
		case 'Escape':
			if (!(document.activeElement instanceof HTMLInputElement)) break;
			(document.activeElement as HTMLInputElement).blur();
			break;
		}
	});
}