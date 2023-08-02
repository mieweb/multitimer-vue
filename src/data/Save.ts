import { Settings, SettingsInterface } from './Settings';
import { RawTimerData } from './TimerData';
import { TimerSystem } from './TimerSystem';

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
			this.save();
			console.log(
				'[%c%s%c] Autosaved all multitimer data into localstorage', 
				'color: blue',
				Date().slice(0, 24),
				'color: initial',
			);
		}, interval);
	}

	public save() {
		const settings = { ...Settings };

		const {
			timers,
			favoriteTimers,
			deletedTimers
		} = TimerSystem.toTimerSystemData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
		localStorage.setItem('deletedTimers', JSON.stringify(deletedTimers));
	}

	public load() {
		TimerSystem.timersFromRaw(loadTimers());
		TimerSystem.favoriteTimersFromList(loadFavoriteTimers());
		TimerSystem.deletedTimersFromRaw(loadDeletedTimers());
		Settings.updateSettings(loadSettings());

		function loadTimers(): RawTimerData[] {
			const timers = localStorage.getItem('timers');
			return timers ? JSON.parse(timers) : [];
		}

		function loadSettings(): Partial<SettingsInterface> {
			const settings = localStorage.getItem('settings');
			return settings ? JSON.parse(settings) : {};
		}

		function loadLocalStorageValue<T>(key: string, callback: (parsedJSON: T) => void) {
			const jsonString = localStorage.getItem(key);
			if (jsonString) {
				callback(JSON.parse(jsonString));
		}
		}
	}
}

// class ServerStorage implements Save {

// }

export function getStorage() {
	return new LocalStorage();
}
