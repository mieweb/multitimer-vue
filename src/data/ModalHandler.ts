import { Modal } from 'bootstrap';
import { Component, shallowRef } from 'vue';

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

export function openModal(newModalComponent: Component, props: object = {}) {
	modalData.component.value = newModalComponent;
	modalData.props = props;

	modal.show();
}

export function clearModal() {
	modalData.component.value = undefined;
	modalData.props = {};
}