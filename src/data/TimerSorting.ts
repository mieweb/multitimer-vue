import Sortable from 'sortablejs';

export function init() {
	const timerList = document.getElementById('timer-list');
	if (!timerList) {
		throw 'Could not find timer list';
	}
	new Sortable(timerList, {
		swap: true,
		handle: '.handle',
		animation: 150,
	});
}
