import { Ref, computed, ref } from 'vue';
import { MultitimerData, SaveInterface, getEasiestSystem, } from './SaveInterface';
import { Settings } from './Settings';
import { TimerSystem } from './TimerSystem';

const saveSystem: Ref<SaveSystem | null> = ref(null);

export function isLoggedIn() {
	return computed(() => saveSystem.value != null);
}

export class SaveSystem {
	private currentSystem: Ref<SaveInterface>;
	private intervalId = NaN;

	public constructor(saveInterface: SaveInterface, autosaveInterval: number) {
		console.log('set');
		this._setAutosaveInterval(autosaveInterval);
		saveInterface.load().then(data => this.startLoading(data));

		window.onbeforeunload = async () => {
			await this.startSaving();
		};

		this.currentSystem = ref(saveInterface);
	}

	public getCurrentSystemRef() {
		return this.currentSystem;
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
	}

	public async startLoading(data: MultitimerData) {
		TimerSystem.importTimerSystemData(data.timerSystemData);
		Settings.updateSettings(data.settings ?? {});
	}
}

export async function initSaveSystem(): Promise<void> {
	//saveSystem.value = new SaveSystem(await getEasiestSystem(), Settings.autosaveInterval);
	return;
}

export function getSaveSystem(): Ref<SaveSystem> {
	return saveSystem as Ref<SaveSystem>; // This should always be available
}

