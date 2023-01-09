import { jsonToInterface, TimerInterface, TimerJSON } from './TimerInterface';
import { reactive } from 'vue';
import format from 'date-fns/format';
import HMS from './HMS';
import { Settings } from './Settings';

export interface TimerFilter {
    search: string,
    withTime: boolean
}

class _TimerSystem {
	static lastId = -1;
	// private map: Map<number, TimerInterface> = new Map();
	private timerList: { id: number, timer: TimerInterface }[] = [];
	private _activeTimerId = NaN;
	private setTimeoutId = NaN;
	public timerToConfirm = NaN;
	private favoriteTimers: TimerInterface[] = [];
	private logDate: Date = new Date(); // Does not sync with frontend, but should convienently the same
	private timerFilter: TimerFilter = {
		search: '',
		withTime: false
	};

	public addTimer(timerData: TimerInterface) {
		if (this.issueExists(timerData.issue)) return;

		this.timerList.push({ id: this.id(), timer: reactive(timerData) });
		// this.map.set(this.id(), reactive(timerData));
	}

	public getTimerList() {
		return this.timerList;
	}

	public isFiltered(timerId: number): boolean {
		const timer = this.getTimerById(timerId);
		if (!timer) return false;
		const filter = this.timerFilter;
		const regex = new RegExp(`.*${filter.search.toLowerCase()}.*`);
		const title = timer.title.toLowerCase();
		const issue = timer.issue;

		if (filter.withTime && !timer.time.hasTime()) {
			return false;
		}

		return !!title.match(regex) || !!issue.match(regex);
	}

	public* iterator(): IterableIterator<[number, TimerInterface]> {
		const filter = this.timerFilter;
		const regex = new RegExp(`.*${filter.search.toLowerCase()}.*`);

		for (const { id, timer } of this.timerList) {
			if (filter.withTime && !timer.time.hasTime()) continue;
			if (!searchMatches(timer, regex)) continue;

			yield [id, timer];
		}

		function searchMatches(timer: TimerInterface, regex: RegExp): boolean {
			const title = timer.title.toLowerCase();
			const issue = timer.issue;

			return !!title.match(regex) || !!issue.match(regex);
		}
	}

	public updateFilter(userFilter: TimerFilter) {
		this.timerFilter = {
			...this.timerFilter,
			...userFilter
		};
	}

	public activeTimerId() {
		return this._activeTimerId;
	}

	public logTimer() {
		const timer = this.pullFromMap();
		this.logFromData(timer);
	}

	public startTimer() {
		const id = this.timerToConfirm;
		const timer = this.pullFromMap();
		const interval = 1000;

		let expected = Date.now() + interval;
		const timeStep = () => {
			console.log('Bink');
			const drift = Date.now() - expected;
			timer.time?.updateTime(new HMS(0, 0, 1));
			expected += interval;
			this.setTimeoutId = window.setTimeout(timeStep, interval - drift);
		};
		this.pauseActiveTimer();
		this._activeTimerId = id;
		this.setTimeoutId = window.setTimeout(timeStep, interval);
	}

	public pauseActiveTimer() {
		clearTimeout(this.setTimeoutId);
		this._activeTimerId = NaN;
		this.setTimeoutId = NaN;
	}

	public deleteTimer() {
		const id = this.timerToConfirm;
		const timer = this.getTimerById(id);
		if (!timer) return;
		this.deleteTimerById(id);
		this.timerToConfirm = NaN;
	}

	public editTimer(changes: Partial<TimerInterface>) {
		const id = this.timerToConfirm;
		const oldTimerData = this.pullFromMap();
		const newTimer = {
			...oldTimerData,
			...changes
		};
		if (newTimer.issue && this.issueExists(newTimer.issue)) {
			newTimer.issue = oldTimerData.issue;
		}
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === id) {
				this.timerList[i].timer = newTimer;
			}
		}
	}

	public selectedTimerData() {
		return this.getTimerById(this.timerToConfirm);
	}
    
	public resetTimer() {
		const timer = this.pullFromMap();
		timer.time = new HMS();
		this.timerToConfirm = NaN;
	}

	public updateTime(hms: HMS) {
		const timer = this.pullFromMap();
		timer.time?.updateTime(hms);
	}

	public addFavorite(): boolean {
		const id = this.timerToConfirm;
		const timerData = this.getTimerById(id);
		if (!timerData) return false;
		this.timerToConfirm = NaN;
		return this.addFavoriteFromInterface(timerData);
	}

	public addFavoriteFromInterface(timerData: TimerInterface): boolean {
		for (const timer of this.favoriteTimers) {
			if (timer.issue === timerData.issue) {
				return false;
			}
		}
		this.favoriteTimers.push(timerData);
		return true;
	}

	public deleteFavorite(issue: string) {
		for (let i = 0; i < this.favoriteTimers.length; ++i) {
			const timer = this.favoriteTimers[i];
			if (timer.issue === issue) {
				this.favoriteTimers.splice(i, 1);
				break;
			}
		}
		this.timerToConfirm = NaN;
	}

	public favorites(): TimerInterface[] {
		return this.favoriteTimers;
	}

	public resetAllTimers() {
		for (const { timer } of this.timerList) {
			timer.time.reset();
		}
	}

	public deleteAllTimers() {
		this.timerList.splice(0, this.timerList.length);
	}

	public logAllTimers() {
		for (const { timer } of this.timerList) {
			this.logFromData(timer);
		}
	}
    
	public setLogDate(date: Date) {
		this.logDate = date;
	}

	public toggleControls() {
		const timer = this.pullFromMap();
		timer.controlsHidden = !timer.controlsHidden;
	}

	public totalTime() {
		const totalTime = new HMS();
		for (const { timer } of this.timerList) {
			const hms = new HMS(
				timer.time.hours,
				timer.time.minutes,
				timer.time.seconds
			);
			totalTime.updateTime(hms);
		}

		return totalTime;
	}

	public saveData() {
		const timers = [];
		const favoriteTimers = this.favoriteTimers;
		for (const { timer } of this.timerList) {
			timers.push(timer);
		}

		return {
			timers,
			favoriteTimers
		};
	}

	public importFromFile(file: File) {
		file.text().then((t) => {
			const saveData: { 
				timers: TimerJSON[],
				favoriteTimers: TimerJSON[]
			} = JSON.parse(t);

			for (const timer of saveData.timers.map(jsonToInterface)) {
				this.addTimer(jsonToInterface(timer));
			}

			for (const timer of saveData.favoriteTimers.map(jsonToInterface)) {
				this.addFavoriteFromInterface(timer);
			}
		});
	}

	private pullFromMap() {
		const timer = this.getTimerById(this.timerToConfirm);
		if (!timer) throw `PullFromMap: Timer doesn't exist with id ${this.timerToConfirm}`;
		this.timerToConfirm = NaN;
		return timer;
	}

	private id() {
		let id = new Date().getTime();
		while (id === _TimerSystem.lastId) {
			id = new Date().getTime();
		}
		_TimerSystem.lastId = id;
		return id;
	}

	private logFromData(timer: TimerInterface) {
		const workedTime = timer.time.roundedTime();
		const logDate = format(this.logDate, 'dd/MM/yyyy');
		const url = `https://pm.mieweb.com/issues/${timer.issue}/time_entries/new?&time_entry[hours]=${workedTime}&time_entry[comments]=${timer.comment}&time_entry[custom_field_values][9]=${timer.billStatus}&time_entry[spent_on]=${logDate}`;
		window.open(url);
	}

	/**
	 * Checks to see if issue exists in timer data map.
	 * Always returns false if `issue` parameter is empty. 
	 * @param issue Issue string, can be empty.
	 */
	private issueExists(issue: string): boolean {
		if (!issue) return false;
		for (const { timer }  of this.timerList) {
			if (issue === timer.issue) return true;
		}
		return false;
	}

	private getTimerById(gettingId: number): TimerInterface | null {
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === gettingId) {
				return this.timerList[i].timer;
			}
		}

		return null;
	}

	private deleteTimerById(removingId: number) {
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === removingId) {
				this.timerList.splice(i, 1);
			}
		}
	}
}

export const TimerSystem = reactive(new _TimerSystem());