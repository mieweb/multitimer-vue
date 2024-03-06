import { Ref, ref } from 'vue';
import { MultitimerData, SaveInterface, getEasiestSystem, } from './SaveInterface';
import { Settings } from './Settings';
import { TimerSystem } from './TimerSystem';

let saveSystem: SaveSystem | null = null;

class SaveSystem {
	private currentSystem: Ref<SaveInterface>;
	private intervalId = NaN;

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

export async function initSaveSystem(): Promise<SaveSystem> {
	saveSystem = new SaveSystem(await getEasiestSystem(), Settings.autosaveInterval);

	return saveSystem;
}

export function getSaveSystem(): SaveSystem {
	return saveSystem as SaveSystem; // This should always be available
}

