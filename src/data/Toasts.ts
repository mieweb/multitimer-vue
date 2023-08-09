// import { Toast } from 'bootstrap'; 
// import { TimerId } from './TimerData';

// export function init() {
// 	const toastElList = document.querySelectorAll('.toast');
// 	Array.from(toastElList).map(toastEl => new Toast(toastEl, {}));
// }

// export const activeTimerClosedEvent = (detail: { timerId: TimerId, timerDelta: number }) => new CustomEvent('activeTimerClosed', { detail });
// let activeTimerClosedData = null;

// export function resumeTimer() {
// 	if (activeTimerClosedData) {
// 		TimerSystem.resumeTimer();
// 	}
// }

// document.addEventListener('activeTimerClosed', (event: Event) => {
// 	activeTimerClosedData = (event as CustomEvent).detail;
// 	Toast.getOrCreateInstance(document.getElementById('active-timer-closed-toast')!, { autohide: false });
// });