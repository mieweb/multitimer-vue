import { SettingsInterface } from './Settings';
import { TimerSystemData } from './TimerSystem';
import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from 'firebase/app';
import { User, getAuth, signInWithEmailAndPassword, browserLocalPersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

class LocalStorageWrap implements SaveInterface {
	public localStorage = new LocalStorage();
	public mainStorage: SaveInterface;

	public constructor(i: SaveInterface) {
		this.mainStorage = i;
	}

	public async save(data: MultitimerData) {
		await this.mainStorage.save(data);
		await this.localStorage.save(data);
	}

	public load() {
		return this.mainStorage.load();
	}

	public name() {
		return this.mainStorage.name();
	}

	public icon() {
		return this.mainStorage.icon();
	}
}

const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyBTbQ-UYcKAR8jwihrxg9u3bryISwMdQ5U',
	authDomain: 'multitimer-test.firebaseapp.com',
	projectId: 'multitimer-test',
	storageBucket: 'multitimer-test.appspot.com',
	messagingSenderId: '119724429684',
	appId: '1:119724429684:web:02b914a6644badd2871c21'
};

const collectionName = 'save-data';

class FirebaseStorage implements SaveInterface {
	public app: FirebaseApp;
	public db: Firestore;
	public auth: Auth;
	public user: User;

	public constructor(app: FirebaseApp, auth: Auth, user: User) {
		this.app = app;
		this.auth = auth;
		this.db = getFirestore(this.app);
		this.user = user;
	}

	public name() {
		return 'Firebase interface';
	}

	public icon(): string {
		return 'fa-fire text-warning';
	}

	public async save(data: MultitimerData): Promise<void> {
		setDoc(doc(this.db, collectionName, this.user.uid), data);
	}

	public async load(): Promise<MultitimerData> {
		const userId = this.user.uid;
		const docRef = await getDoc(doc(this.db, collectionName, userId));

		if (!docRef.exists()) {
			throw Error('Doc doesn\'t exist.');
		}

		return docRef.data() as MultitimerData;
	}
}

export async function getFirebase(email: string, password: string) {
	const app = getApp();
	const auth = getAuth(app);

	await auth.setPersistence(browserLocalPersistence);

	const { user } = await signInWithEmailAndPassword(auth, email, password);
	const firebaseStorage = new FirebaseStorage(app, auth, user);

	return new LocalStorageWrap(firebaseStorage);
}

export async function getEasiestSystem(): Promise<SaveInterface> {
	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);

	await auth.setPersistence(browserLocalPersistence);
	if (auth.currentUser) {
		return new LocalStorageWrap(new FirebaseStorage(app, auth, auth.currentUser));
	} else {
		return new LocalStorage();
	}
}
