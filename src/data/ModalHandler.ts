import { Modal } from 'bootstrap';
import { Component, shallowRef } from 'vue';
import { TimerId, TimerData } from './TimerData';
import { MeetingData } from '../data/ImportMeetings';

let modal: Modal;
const modalData = {
	component: shallowRef<Component>(),
	props: {}
};

export function init() {
	modal = new Modal('#modal-container');
	document.addEventListener('shown.bs.modal', () => {
		const input: HTMLInputElement | null = document.querySelector('.modal-focus-input');
		input?.focus();
	});
	document.addEventListener('hidden.bs.modal', () => {
		clearModal();
	});
}

export function componentReference() {
	return modalData;
}

export function show() {
	modal.show();
}

export type ModalData = {
	timerId: TimerId,
	timerData: Partial<TimerData>,
	importMeetingData: MeetingData[],
}

export function openModal(newModalComponent: Component, incomingProps?: Partial<ModalData>) {
	const props = {
		timerId: NaN,
		timerData: {},
		importMeetingData: [],
		...incomingProps
	};
	modalData.props = props;
	modalData.component.value = newModalComponent;
	modal.show();
}

export function closeModal() {
	modal.hide();
}

export function clearModal() {
	modalData.component.value = undefined;
	modalData.props = {};
}
