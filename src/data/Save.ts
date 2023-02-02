import { Settings, SettingsInterface } from './Settings';
import { formToInterface, TimerInterface, TimerJSON } from './TimerInterface';
import { TimerSystem } from './TimerSystem';

export interface SaveData {
    timers: {
        timerData: TimerInterface
    }[],
    settings: SettingsInterface
}

interface Save {
	setAutosave(interval: number): void;
    save(): void;
    load(): void;
}

class LocalStorage implements Save {
	private intervalId = NaN;

	public setAutosave(interval: number) {
		window.clearInterval(this.intervalId);
		this.intervalId = window.setInterval(() => {
			this.save();
		}, interval);
	}

	public save() {
		const settings = { ...Settings };

		const {
			timers,
			favoriteTimers
		} = TimerSystem.saveData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
	}

	public load() {
		const timers = loadTimers().map(formToInterface);
		const favoriteTimers = loadFavoriteTimers().map(formToInterface);
		const settings = loadSettings();

		TimerSystem.loadTimerList(timers);

		for (const timer of favoriteTimers) {
			TimerSystem.addFavoriteFromInterface(timer);
		}

		Settings.updateSettings(settings);

		function loadTimers(): TimerJSON[] {
			const timers = localStorage.getItem('timers');
			return timers ? JSON.parse(timers) : [];
		}

		function loadSettings(): Partial<SettingsInterface> {
			const settings = localStorage.getItem('settings');
			return settings ? JSON.parse(settings) : {};
		}

		function loadFavoriteTimers(): TimerJSON[] {
			const timers = localStorage.getItem('favoriteTimers');
			return timers ? JSON.parse(timers) : [];
		}
	}
}

// class ServerStorage implements Save {

// }

export function getStorage() {
	return new LocalStorage();
}
