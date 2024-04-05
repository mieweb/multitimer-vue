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

class MongoStorage implements SaveInterface {
	private token: string; 

	public constructor(token: string) {
		this.token = token;
	}

	public name(): string {
		return 'Mongo Storage';
	}

	public icon(): string {
		return 'fa-leaf';
	}

	public async save(multitimerData: MultitimerData): Promise<void> {
		const body = { 
			multitimerData,
			headers: {
				token: this.token
			}
		};

		await fetch('/save/mongo-post', {
			method: 'POST',
			body: JSON.stringify(body), 
			headers: { 'Content-Type': 'application/json', token: this.token }
		});

		return;
	}

	public async load(): Promise<MultitimerData> {
		const options = {
			headers: {
				token: this.token
			}
		};
		const res = await fetch('/save/mongo-get', options);
		const json = await res.json();

		if (Object.keys(json).length === 0) {
			return {
				timestamp: Date.now(),
				timerSystemData: {
					timers: [],
					favoriteTimers: [],
					deletedTimers: [] 
				},
			} as MultitimerData;
		}

		return json as MultitimerData;
	}
}

export async function registerMongoSystem(username: string, password: string): Promise<MongoStorage> {
	const options = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			username,
			password
		})
	};

	const res = await fetch('/save/mongo-register', options);

	if (res.status !== 201) {
		throw new Error(await res.text());
	}

	return new MongoStorage(await res.text());
}

export async function signInMongoSystem(username: string, password: string): Promise<MongoStorage> {
	const options = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			username,
			password
		})
	};
	const res = await fetch('/save/mongo-login', options);

	if (res.status !== 200) {
		throw new Error(await res.text());
	}

	return new MongoStorage(await res.text());
}

export async function getEasiestSystem(username: string, password: string): Promise<SaveInterface | null> {
	const mongoSystem = await signInMongoSystem(username, password);

	if (mongoSystem) {
		return mongoSystem;
	}

	return null;
}