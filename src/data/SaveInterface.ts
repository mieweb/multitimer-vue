import { resolve } from 'path';
import { Settings, SettingsInterface } from './Settings';
import { FavoriteTimer, RawTimerData } from './TimerData';
import { TimerSystem } from './TimerSystem';
import { rejects } from 'assert';

export interface SaveInterface {
	name(): string;
    save(): Promise<void>;
    load(): Promise<void>;
}

class LocalStorage implements SaveInterface {
	public name(): string {
		return 'Local Storage';
	}

	public save(): Promise<void> {
		return new Promise((resolve, _) => {
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

			resolve();
		});
	}

	public load(): Promise<void> {
		return new Promise((resolve, _) => {
			loadLocalStorageValue('timers', (j: RawTimerData[]) => TimerSystem.timersFromRaw(j));
			loadLocalStorageValue('favoriteTimers', (j: FavoriteTimer[]) => TimerSystem.favoriteTimersFromList(j));
			loadLocalStorageValue('settings', (j: Partial<SettingsInterface>) => Settings.updateSettings(j));
			loadLocalStorageValue('deletedTimers', (j: RawTimerData[]) => TimerSystem.deletedTimersFromRaw(j));

			resolve();
		});

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

class DummyServerStorage implements SaveInterface {
	private timers: RawTimerData[] = [];
	private favoriteTimers: FavoriteTimer[] = [];
	private deletedTimers: RawTimerData[] = [];

	public name(): string {
		return 'Dummy Server';
	}

	public save(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const timerData = TimerSystem.toTimerSystemData();
				this.timers = timerData.timers;
				this.favoriteTimers = timerData.favoriteTimers;
				this.deletedTimers = timerData.deletedTimers;

				resolve();
			}, 3000);
		});
	}

	public load(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				TimerSystem.timersFromRaw(this.timers);
				TimerSystem.favoriteTimersFromList(this.favoriteTimers);
				TimerSystem.deletedTimersFromRaw(this.deletedTimers);

				resolve();
			}, 3000);
		});
	}
}

class FailingDummyServerStorage implements SaveInterface {
	private timers: RawTimerData[] = [];
	private favoriteTimers: FavoriteTimer[] = [];
	private deletedTimers: RawTimerData[] = [];

	public name() {
		return 'Failing Dummy Server';
	}

	public save(): Promise<void> {
		return new Promise((_, reject) => {
			setTimeout(() => {
				reject('Could not save to server.');
			}, 3000);
		});
	}

	public load(): Promise<void> {
		return new Promise((_, reject) => {
			setTimeout(() => {
				reject('Could not load from server');
			}, 3000);
		});
	}
}

export function getStorage(): SaveInterface[] {
	return [new LocalStorage(), new DummyServerStorage(), new FailingDummyServerStorage()];
}
