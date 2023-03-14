import { Settings, SettingsInterface } from './Settings';
import { rawToTimerData, RawTimerData } from './TimerData';
import { TimerSystem } from './TimerSystem';

export interface SaveData {
    timers: RawTimerData[],
    settings: SettingsInterface,
	favoriteTimers: RawTimerData[]
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
		} = TimerSystem.toSaveData();

		localStorage.setItem('timers', JSON.stringify(timers));
		localStorage.setItem('settings', JSON.stringify(settings));
		localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
	}

	public load() {
		const timers = loadTimers().map(rawToTimerData);
		const favoriteTimers = loadFavoriteTimers().map(rawTimerData => {
			rawTimerData.time.hours = 0;
			rawTimerData.time.minutes = 0;
			rawTimerData.time.seconds = 0;
			return rawToTimerData(rawTimerData);
		});
		const settings = loadSettings();

		TimerSystem.loadTimerList(timers);

		for (const timer of favoriteTimers) {
			TimerSystem.addFavoriteFromInterface(timer);
		}

		Settings.updateSettings(settings);

		function loadTimers(): RawTimerData[] {
			const timers = localStorage.getItem('timers');
			return timers ? JSON.parse(timers) : [];
		}

		function loadSettings(): Partial<SettingsInterface> {
			const settings = localStorage.getItem('settings');
			return settings ? JSON.parse(settings) : {};
		}

		function loadFavoriteTimers(): RawTimerData[] {
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
