import { getStorage } from './SaveInterface';
import { Settings } from './Settings';

let saveNotifier: SaveNotifier | null = null;

export function getSaveNotifier(): SaveNotifier {
	if (!saveNotifier) {
		saveNotifier = new SaveNotifier(Settings.autosaveInterval);
	}

	return saveNotifier;
}

class SaveNotifier {
	private saveSystem = getStorage();
	private intervalId;

	public constructor(seconds: number) {
		this.intervalId = this._setAutosaveInterval(seconds);

		window.onbeforeunload = () => {
			for (let i = 0; i < 100000000; i++) { 
				i;
			}
			this.saveSystem.save();
		};
		window.onload = this.saveSystem.load;

		document.addEventListener('save:request', () => {
			this.startSaving();
		});
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

	private startSaving() {
		document.dispatchEvent(new Event('save:start'));
		this.saveSystem.save();
		document.dispatchEvent(new Event('save:complete'));
		console.log(
			'[%c%s%c] Autosaved all multitimer data into localstorage', 
			'color: blue',
			Date().slice(0, 24),
			'color: initial',
		);
	}
}