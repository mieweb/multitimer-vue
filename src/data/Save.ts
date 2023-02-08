import { Settings, SettingsInterface } from './Settings';
import { jsonToInterface, TimerJSON } from './TimerInterface';
import { TimerSystem } from './TimerSystem';

export interface SaveData {
    timers: TimerJSON[],
    settings: SettingsInterface,
	favoriteTimers: TimerJSON[]
}

interface Save {
	setAutosaveInterval(interval: number): void;
    save(): void;
    load(): void;
}

class LocalStorage implements Save {
	private intervalId = NaN;

	public setAutosaveInterval(seconds: number) {
		const interval = seconds * 60000;
		window.clearInterval(this.intervalId);
		this.intervalId = window.setInterval(() => {
			console.log('Saved!');
			this.save();
		}, interval);
	}

	public save() {
		const settings = { ...Settings };

		const {
			timers,
			favoriteTimers
		} = TimerSystem.toSaveData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
	}

	public load() {
		console.log(TimerSystem);
		const timers = loadTimers().map(jsonToInterface);
		const favoriteTimers = loadFavoriteTimers().map(jsonToInterface);
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
