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
	private map: Map<number, TimerInterface> = new Map();
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

		this.map.set(this.id(), reactive(timerData));
		console.log(this.map);
	}

	public* iterator(): IterableIterator<[number, TimerInterface]> {
		const filter = this.timerFilter;
		const regex = new RegExp(`.*${filter.search.toLowerCase()}.*`);

		for (const [id, timer] of this.map.entries()) {
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

	public allTimers() {
		return this.map.values();
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
		const timer = this.map.get(id);
		if (!timer) return;
		this.map.delete(id);
		this.timerToConfirm = NaN;
	}

	public editTimer(changes: Partial<TimerInterface>) {
		const id = this.timerToConfirm;
		const newTimer  = {
			...this.pullFromMap(),
			...changes
		};
		this.map.set(id, newTimer);
		this.timerToConfirm = NaN;
	}

	public selectedTimerData() {
		return this.map.get(this.timerToConfirm);
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
		const timerData = this.map.get(id);
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
		for (const timer of this.map.values()) {
			timer.time.reset();
		}
	}

	public deleteAllTimers() {
		this.map.clear();
	}

	public logAllTimers() {
		for (const timer of this.map.values()) {
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
		for (const timer of this.map.values()) {
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
		for (const timer of this.map.values()) {
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

	private issueExists(issue: string) {
		for (const timer of this.map.values()) {
			if (issue === timer.issue) {
				return true;
			}
		}
		return false;
	}

	private pullFromMap() {
		const timer = this.map.get(this.timerToConfirm);
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
		const workedTime = roundTime(timer.time);
		const logDate = format(this.logDate, 'dd/MM/yyyy');
		const url = `https://pm.mieweb.com/issues/${timer.issue}/time_entries/new?&time_entry[hours]=${workedTime}&time_entry[comments]=${timer.comment}&time_entry[custom_field_values][9]=${timer.billStatus}&time_entry[spent_on]=${logDate}`;
		window.open(url);

		function roundTime(time: HMS) {
			let min = time.minutes;

			if (time.seconds > 0) ++min;
			min += time.hours * 60;
			if (min === 0) return 0;

			// Experimental rounding
			return minToRound(min, Settings.roundToMinutes);

			function minToRound(m: number, r: number): number {
				return (Math.ceil(m / r) * r) / 60;
			}
		}
	}
}

export const TimerSystem = reactive(new _TimerSystem());