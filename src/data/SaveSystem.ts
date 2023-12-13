import { SaveInterface, getStorage } from './SaveInterface';
import { Settings } from './Settings';

let saveNotifier: SaveNotifier | null = null;

export enum SaveSystemStatus {
	Prepared,
	Succeeded,
	Failed
}

export type SaveSystemInfo = {
	name: string,
	status: SaveSystemStatus,
	statusMessage: string
}

export function getSaveNotifier(): SaveNotifier {
	if (!saveNotifier) {
		saveNotifier = new SaveNotifier(Settings.autosaveInterval);
	}

	return saveNotifier;
}

function saveFromInterface(si: SaveInterface): Promise<void> {
	return si.save();
}

class SaveNotifier {
	private saveSystems = getStorage();
	private saveSystemsLogging: PromiseSettledResult<void>[] = [];
	private intervalId;

	public systemStatuses(): SaveSystemInfo[] {
		let info;

		if (this.saveSystemsLogging.length) {
			info = this.saveSystemsLogging.map((s, i) => {
				let status;
				let statusMessage;

				if (s.status === 'fulfilled') {
					status = SaveSystemStatus.Succeeded;
					statusMessage = '';
				} else {
					status = SaveSystemStatus.Failed;
					statusMessage = s.reason;
				}

				return {
					name: this.saveSystems[i].name(),
					status,
					statusMessage
				};
			});
		} else {
			info = this.saveSystems.map(s => {
				return {
					name: s.name(),
					status: SaveSystemStatus.Prepared,
					statusMessage: ''
				};
			});
		}

		return info;
	}

	public constructor(seconds: number) {
		this.intervalId = this._setAutosaveInterval(seconds);

		window.onbeforeunload = async () => {
			await Promise.all(this.saveSystems.map(saveFromInterface));
		};
		window.onload = () => {
			this.saveSystems[0].load();
		};

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

	public async startSaving() {
		document.dispatchEvent(new Event('save:start'));
		const savePromises = this.saveSystems.map(saveFromInterface);
		this.saveSystemsLogging = await Promise.allSettled(savePromises);
		const event = saveEvent(this.saveSystemsLogging);
		document.dispatchEvent(event);
		console.log(
			'[%c%s%c] Autosaved all multitimer data into localstorage', 
			'color: blue',
			Date().slice(0, 24),
			'color: initial',
		);
	}
}

function saveEvent(settledResults: PromiseSettledResult<void>[]): Event {
	let event;
	let failCount = 0;

	for (const result of settledResults) {
		if (result.status === 'rejected') {
			failCount += 1;
		}
	}

	if (failCount === settledResults.length) {
		event = new Event('save:failed');
	} else if (failCount > 0) {
		event = new Event('save:incomplete');
	} else {
		event = new Event('save:complete');
	}

	return event;
}