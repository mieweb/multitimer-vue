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
			favoriteTimers
		} = TimerSystem.toTimerSystemData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
	}

	public load() {
		TimerSystem.timersFromRaw(loadTimers());
		TimerSystem.favoriteTimersFromRaw(loadFavoriteTimers());
		Settings.updateSettings(loadSettings());

		function loadTimers(): RawTimerData[] {
			const timers = localStorage.getItem('timers');
			return timers ? JSON.parse(timers) : [];
		}

		function loadSettings(): Partial<SettingsInterface> {
			const settings = localStorage.getItem('settings');
			return settings ? JSON.parse(settings) : {};
		}

		function loadFavoriteTimers(): RawTimerData[] {
			const favoritesJSONString = localStorage.getItem('favoriteTimers');
			if (!favoritesJSONString) return [];
			
			return JSON.parse(favoritesJSONString);
		}
	}
}

// class ServerStorage implements Save {

// }

export function getStorage() {
	return new LocalStorage();
}
