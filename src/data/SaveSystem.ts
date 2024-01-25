import { Ref, ref } from 'vue';
import { FirebaseStorage, MultitimerData, SaveInterface, getEasiestSystem, getFirebase, } from './SaveInterface';
import { Settings } from './Settings';
import { TimerSystem } from './TimerSystem';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export enum SaveSystemStatus {
	Prepared,
	Succeeded,
	Failed
}

export enum SaveNotifierState {
	InProgress,
	Incomplete,
	Complete,
	Failed
}

export type SaveSystemInfo = {
	name: string,
	status: SaveSystemStatus,
	statusMessage: string
}

let secureSaveSystemG: SecureSaveSystem | null = null;
let saveSystemG: SaveSystem | null = null;

function toMilliseconds(seconds: number) {
	return 60000 * seconds;
}

class SecureSaveSystem {
	private saveStorage: SaveInterface | null = null;
	private signedIn = ref(false);
	private autosaveInterval;
	private savingState = ref(SaveNotifierState.Complete);
	private intervalId = NaN;
	private unloadSave = async () => {
		await this.startSaving();
	};

	public constructor(autosaveInterval: number, si?: SaveInterface) {
		this.autosaveInterval = toMilliseconds(autosaveInterval);

		if (si) {
			this.setSaveSystem(si);
		}
	}

	public signInRef() {
		return this.signedIn;
	}

	public async signOut() {
		if (!(this.saveStorage instanceof FirebaseStorage)) {
			throw new Error('Unimplemented for other interfaces');
		}

		const auth = getAuth();

		await this.startSaving();
		await auth.signOut();
		this.signedIn.value = false;
		this.stopSaveFunctions();
	}

	public setSaveSystem(si: SaveInterface) {
		this.saveStorage = si;
		this.signedIn.value = true;
		this.startSaveFunctions();
		this.startLoading();
	}

	public startSaveFunctions() {
		this.intervalId = window.setInterval(() => { // TODO: This should set to an id in the class, so that it can be stopped when logged out
			this.startSaving();
		}, this.autosaveInterval);
		document.addEventListener('visibilitychange', this.unloadSave);
	}

	public stopSaveFunctions() {
		window.clearInterval(this.intervalId);
		document.removeEventListener('visibilitychange', this.unloadSave);
	}

	public setAutosaveInterval(seconds: number): number {
		window.clearInterval(this.autosaveInterval);
		return this._setAutosaveInterval(seconds);
	}

	private _setAutosaveInterval(seconds: number): number {
		const interval = seconds * 60000;
		return window.setInterval(() => {
			this.startSaving();
		}, interval);
	}


	public async startSaving() {
		if (!this.saveStorage) {
			throw new Error('No save system set. This isn\'t supposed to happen.');
		}

		const saveSystem = this.saveStorage;
		this.savingState.value = SaveNotifierState.InProgress;
		const data: MultitimerData = {
			timestamp: Date.now(),
			timerSystemData: TimerSystem.toTimerSystemData(),
			settings: Settings.dataCopy()
		};
		await saveSystem.save(data);
		console.log(
			`[%c%s%c] Autosaved multitimer data using the ${saveSystem.name()} saving system`, 
			'color: blue',
			Date().slice(0, 24),
			'color: initial',
		);
		this.savingState.value = SaveNotifierState.Complete;
	}

	public async startLoading() {
		if (this.saveStorage) {
			const data = await this.saveStorage.load();

			TimerSystem.importTimerSystemData(data.timerSystemData);
			Settings.updateSettings(data.settings ?? {});
		}
	}
}

class SaveSystem {
	private currentSystem: Ref<SaveInterface>;
	private intervalId = NaN;
	private savingState = ref(SaveNotifierState.Complete);

	public getSavingState() {
		return this.savingState;
	}

	public constructor(si: SaveInterface, autosaveInterval: number) {
		this.currentSystem = ref(si);
		this._setAutosaveInterval(autosaveInterval);
		this.currentSystem.value.load().then(data => this.startLoading(data));

		window.onbeforeunload = async () => {
			await this.startSaving();
		};
	}

	public getCurrentSystemRef() {
		return this.currentSystem;
	}

	public async setCurrentSystem(i: SaveInterface) {
		if (i.name() === this.currentSystem.value.name()) {
			return;
		}
		
		const previousSystem = this.currentSystem.value;
		const previousSave = await previousSystem.load();

		this.currentSystem.value = i;

		const currentSave = await this.currentSystem.value.load();

		if (previousSave.timestamp < currentSave.timestamp) {
			this.startLoading(currentSave);
		}
	}

	public setAutosaveInterval(seconds: number): number {
		window.clearInterval(this.intervalId);
		return this._setAutosaveInterval(seconds);
	}

	private _setAutosaveInterval(seconds: number): number {
		const interval = seconds * 60000;
		return window.setInterval(() => {
			this.startSaving();
		}, interval);
	}

	public async startSaving() {
		this.savingState.value = SaveNotifierState.InProgress;
		const data: MultitimerData = {
			timestamp: Date.now(),
			timerSystemData: TimerSystem.toTimerSystemData(),
			settings: Settings.dataCopy()
		};
		await this.currentSystem.value.save(data);
		console.log(
			`[%c%s%c] Autosaved multitimer data using the ${this.currentSystem.value.name()} saving system`, 
			'color: blue',
			Date().slice(0, 24),
			'color: initial',
		);
		this.savingState.value = SaveNotifierState.Complete;
	}

	public async startLoading(data: MultitimerData) {
		// TODO: Make this function actually load from `this`
		TimerSystem.importTimerSystemData(data.timerSystemData);
		Settings.updateSettings(data.settings ?? {});
	}
}

export async function initSecureSaveSystem(): Promise<SecureSaveSystem> {
	const app = getApp();
	const auth = getAuth(app);

	let optionalSaveInterface = undefined;
	if (auth.currentUser) {
		optionalSaveInterface = new FirebaseStorage(app, auth, auth.currentUser);
	}

	secureSaveSystemG =  new SecureSaveSystem(Settings.autosaveInterval, optionalSaveInterface);

	return secureSaveSystemG;
}

export async function initSaveSystem(): Promise<SaveSystem> {
	saveSystemG = new SaveSystem(await getEasiestSystem(), Settings.autosaveInterval);

	return saveSystemG;
}

export function getSaveSystem(): SecureSaveSystem {
	if (secureSaveSystemG) {
		return secureSaveSystemG;
	} else {
		throw new Error('Save system not initialized.');
	}
}
