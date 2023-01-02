import { Settings, SettingsInterface } from './Settings';
import { jsonToInterface, TimerInterface, TimerJSON } from './TimerInterface';
import { TimerSystem } from './TimerSystem';

export interface SaveData {
    timers: {
        timerData: TimerInterface
    }[],
    settings: SettingsInterface
}

interface Save {
    save(): void;
    load(): void;
}

class LocalStorage implements Save {
	save() {
		const settings = { ...Settings };

		const {
			timers,
			favoriteTimers
		} = TimerSystem.saveData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
	}

	load() {
		const timers = loadTimers().map(jsonToInterface);
		const favoriteTimers = loadFavoriteTimers().map(jsonToInterface);
		const settings = loadSettings();

		for (const timer of timers) {
			TimerSystem.addTimer(timer);
		}

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
