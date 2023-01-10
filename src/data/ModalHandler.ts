import { Modal } from 'bootstrap';
import { Component, shallowRef } from 'vue';
import { TimerId, TimerInterface } from './TimerInterface';
import { MeetingData } from '../data/ImportMeetings';

let modal: Modal;
const modalData = {
	component: shallowRef<Component>(),
	props: {}
};

export function init() {
	modal = new Modal('#modal-container');
}

export function componentReference() {
	return modalData;
}

export function show() {
	modal.show();
}

export interface ModalData {
	timerId: TimerId,
	timerData: Partial<TimerInterface>,
	importMeetingData: MeetingData[]
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

export function clearModal() {
	modalData.component.value = undefined;
	modalData.props = {};
}