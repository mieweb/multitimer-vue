import { SettingsInterface } from './Settings';
import { TimerSystemData } from './TimerSystem';
export type MultitimerData = {
	timestamp: number,
	timerSystemData: TimerSystemData,
	settings?: SettingsInterface
};

export interface SaveInterface {
	name(): string;
    save(multitimerData: MultitimerData): Promise<void>;
    load(): Promise<MultitimerData>;
	icon(): string;
}

export class LocalStorage implements SaveInterface {
	public name(): string {
		return 'Local Storage';
	}

	public icon(): string {
		return 'fa-computer';
	}

	public save(multitimerData: MultitimerData): Promise<void> {
		return new Promise(resolve => {
			const {
				settings,
				timerSystemData
			} = multitimerData;
			const {
				timers,
				favoriteTimers,
				deletedTimers
			} = timerSystemData;
			const timestamp = Date.now();

			localStorage.setItem('timestamp', JSON.stringify(timestamp));
			localStorage.setItem('timers', JSON.stringify(timers));
			localStorage.setItem('settings', JSON.stringify(settings));
			localStorage.setItem('favoriteTimers', JSON.stringify(favoriteTimers));
			localStorage.setItem('deletedTimers', JSON.stringify(deletedTimers));

			resolve();
		});
	}

	public load(): Promise<MultitimerData> {
		return new Promise(resolve => {
			const data: MultitimerData = {
				timestamp: loadLocalStorageValue('timestamp') || 0,
				timerSystemData: {
					timers: loadLocalStorageValue('timers') || [],
					favoriteTimers: loadLocalStorageValue('favoriteTimers') || [],
					deletedTimers: loadLocalStorageValue('deletedTimers') || []
				},
				settings: loadLocalStorageValue('settings')
			};

			resolve(data);
		});

		function loadLocalStorageValue<T>(key: string): T | undefined {
			const jsonString = localStorage.getItem(key);
			if (jsonString) {
				return JSON.parse(jsonString);
			}
		}
	}
}

export async function getEasiestSystem(): Promise<SaveInterface> {
	return new LocalStorage();
}
