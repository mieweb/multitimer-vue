import { getActivityValue, TimerData, TimerId, timerDataToRaw, FavoriteTimer, BillStatus, RawTimerData, rawToTimerData } from './TimerData';
import { reactive } from 'vue';
import format from 'date-fns/format';
import HMS from './HMS';
import { Settings } from './Settings';
import { isBillStatus } from './TimerData';

export interface TimerFilter {
    search: string,
    withTime: boolean
}

export type TimerSystemData = {
	timers: RawTimerData[],
	favoriteTimers: FavoriteTimer[]
};

function checkBillStatus(billString: string): BillStatus {
	return isBillStatus(billString) ? billString : 'Non-Billable';
}

class _TimerSystem {
	static lastId = -1;
	// private map: Map<number, TimerInterface> = new Map();
	private timerList: { id: TimerId, timer: TimerData }[] = [];
	private setTimeoutId = NaN;
	public timerToConfirm = NaN;
	public activeTimerId = NaN;
	private favoriteTimers: FavoriteTimer[] = [];
	private logDate: Date = new Date(); // Does not sync with frontend, but should convienently the same
	private timerFilter: TimerFilter = {
		search: '',
		withTime: false
	};
	
	public addTimer(timerData: TimerData): boolean {
		if (this.issueExistsInTimerList(timerData.issue)) return false;
		const id = this.newId();
		this.timerList.unshift({ id, timer: reactive(timerData) });
		this.startTimer(id);
		return true;
	}

	public splitTimer(timerData: TimerData): boolean {
		if (this.issueExistsInTimerList(timerData.issue)) return false;
		if (!this.activeTimerId) {
			return this.addTimer(timerData);
		}

		const splitFromTimer = this.getTimerById(this.activeTimerId);
		const removeTime = new HMS(
			-timerData.time.hours,
			-timerData.time.minutes,
			-timerData.time.seconds
		);
		splitFromTimer.time.updateTime(removeTime);
		const id = this.newId();
		this.timerList.unshift({ id, timer: reactive(timerData) });
		this.startTimer(id);
		return true;
	}

	/**
	 * Loads a list of timers to `timerList`. This does not destroy timers that may currently be in the list,
	 * nor does it start any timers.
	 * @param timerList A list of timers
	 */
	public loadTimerList(timerList: TimerData[]) {
		for (const timerData of timerList.filter(timer => !this.issueExistsInTimerList(timer.issue))) {
			this.timerList.push({ id: this.newId(), timer: reactive(timerData) });
		}
	}

	/**
	 * Special function similar to `loadTimerList`, but updates timers that already exists from the given data
	 * @param meetings Outlook meetings to import
	 */
	public importOutlookMeetings(meetings: TimerData[]) {
		for (const meeting of meetings) {
			const existingTimer = this.issueExistsInTimerList(meeting.issue);
			if (existingTimer) {
				existingTimer.time = HMS.fromObject(meeting.time);
			} else {
				this.timerList.push({ id: this.newId(), timer: reactive(meeting) });
			}
		}
	}

	public getTimerList() {
		return this.timerList;
	}

	public isFiltered(id: TimerId): boolean {
		try {
			const timer = this.getTimerById(id);
			const filter = this.timerFilter;
			const regex = new RegExp(`.*${filter.search.toLowerCase()}.*`);
			const title = timer.title.toLowerCase();
			const issue = timer.issue;

			if (filter.withTime && !timer.time.hasTime()) {
				return false;
			}

			return !!title.match(regex) || !!issue.match(regex);
		} catch {
			return false;
		}
	}

	public* iterator(): IterableIterator<[number, TimerData]> {
		const filter = this.timerFilter;
		const regex = new RegExp(`.*${filter.search.toLowerCase()}.*`);

		for (const { id, timer } of this.timerList) {
			if (filter.withTime && !timer.time.hasTime()) continue;
			if (!searchMatches(timer, regex)) continue;

			yield [id, timer];
		}

		function searchMatches(timer: TimerData, regex: RegExp): boolean {
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

	public logTimer(id: TimerId) {
		const timer = this.getTimerById(id);
		this.logFromData(timer);
	}

	public startTimer(id: TimerId) {
		const timer = this.getTimerById(id);
		const interval = 1000;
		const startDate = Date.now();

		timer.lastUsed = startDate;
		this.pauseActiveTimer();
		this.activeTimerId = id;

		let expected = startDate + interval;
		const timeStep = () => {
			const drift = Date.now() - expected;
			timer.time?.updateTime(new HMS(0, 0, 1));
			expected += interval;
			this.setTimeoutId = window.setTimeout(timeStep, interval - drift);
		};
		this.setTimeoutId = window.setTimeout(timeStep, interval);
	}

	public pauseActiveTimer() {
		clearTimeout(this.setTimeoutId);
		this.activeTimerId = NaN;
		this.setTimeoutId = NaN;
	}

	public removeTimer(id: TimerId) {
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === id) {
				this.timerList.splice(i, 1);
			}
		}
	}

	public editTimer(id: TimerId, changes: Partial<TimerData>) {
		const oldTimerData = this.getTimerById(id);
		const newTimerData = {
			...oldTimerData,
			...changes
		};
		if (newTimerData.issue && this.issueExistsInTimerList(newTimerData.issue)) {
			newTimerData.issue = oldTimerData.issue;
		}
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === id) {
				this.timerList[i].timer = newTimerData;
			}
		}
	}

	public timerIsActive(id: TimerId) {
		return this.activeTimerId === id;
	}
    
	public resetTimer(id: TimerId) {
		const timer = this.getTimerById(id);
		timer.time.reset();
	}

	public updateTime(id: TimerId, hms: HMS) {
		const timer = this.getTimerById(id);
		timer.time?.updateTime(hms);
		timer.lastUsed = Date.now();
	}

	public createFavoriteFromId(id: TimerId) {
		const timerRef = this.getTimerById(id);
		const timerData: FavoriteTimer = {
			issue: timerRef.issue,
			title: timerRef.title,
			link: timerRef.link,
			billStatus: timerRef.billStatus,
			activity: timerRef.activity
		};
		return this.createFavoriteFromInterface(timerData);
	}

	public addFavoriteToTimerList(timer: FavoriteTimer): boolean {
		return this.addTimer({
			...timer,
			time: new HMS(),
			comment: '',
			controlsHidden: Settings.hideControls,
			lastUsed: Date.now()
		});
	}

	public createFavoriteFromInterface(timerData: FavoriteTimer) {
		for (const timer of this.favoriteTimers) {
			if (timer.issue === timerData.issue) {
				throw new Error(`A favorite with issue ${timerData.issue} already exists`);
			}
		}
		this.favoriteTimers.push(timerData);
	}

	public removeFavorite(issue: string) {
		for (let i = 0; i < this.favoriteTimers.length; ++i) {
			const timer = this.favoriteTimers[i];
			if (timer.issue === issue) {
				this.favoriteTimers.splice(i, 1);
				break;
			}
		}
		this.timerToConfirm = NaN;
	}

	public favorites(): FavoriteTimer[] {
		return this.favoriteTimers;
	}

	public resetAllTimers() {
		for (const { id } of this.timerList) {
			TimerSystem.resetTimer(id);
		}
	}

	public removeAllTimers() {
		this.timerList.splice(0, this.timerList.length);
	}

	public logAllTimers() {
		const timersWithTime = this.timerList.filter(timerEntry => {
			const { time, issue } = timerEntry.timer;
			return time.hasTime() && issue.length;
		});
		for (const { timer } of timersWithTime) {
			this.logFromData(timer);
		}
	}
    
	public setLogDate(date: Date) {
		this.logDate = date;
	}

	public toggleControls(id: TimerId) {
		const timer = this.getTimerById(id);
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

	public toTimerSystemData(): TimerSystemData {
		return {
			timers: Array.from(this.timerList.map(te => timerDataToRaw(te.timer))),
			favoriteTimers: Array.from(this.favoriteTimers)
		} as TimerSystemData;
	}

	public timersFromRaw(rawTimers: RawTimerData[]) {
		for (const rawTimer of rawTimers) {
			this.timerList.push({ 
				id: this.newId(),
				timer: reactive(rawToTimerData(rawTimer))
			});
		}
	}

	public favoriteTimersFromRaw(rawFavorites: FavoriteTimer[]) {
		for (const rawTimer of rawFavorites) {
			this.createFavoriteFromInterface({
				issue: rawTimer.issue ?? '',
				title: rawTimer.title ?? '',
				link: rawTimer.link ?? '',
				billStatus: checkBillStatus(rawTimer.billStatus),
				activity: rawTimer.activity ?? Settings.defaultActivity
			});
		}
	}

	/**
	 * Imports from save data.
	 * @param saveData Savedata to load
	 */
	public importTimerSystemData(timerSystemData: TimerSystemData) {
		this.timersFromRaw(timerSystemData.timers as RawTimerData[] ?? []);
		this.favoriteTimersFromRaw(timerSystemData.favoriteTimers as RawTimerData[] ?? []);
	}

	private newId() {
		let id = new Date().getTime();
		while (id === _TimerSystem.lastId) {
			id = new Date().getTime();
		}
		_TimerSystem.lastId = id;
		return id;
	}

	private logFromData(timer: TimerData) {
		const workedTime = timer.time.roundedTime();
		const logDate = format(
			Settings.lastUsedForLogging ? new Date(timer.lastUsed) : this.logDate,
			'dd/MM/yyyy'
		);
		const url = 
			`https://pm.mieweb.com/issues/${timer.issue}/time_entries/new?&time_entry[hours]=${workedTime}&time_entry[comments]=${timer.comment}&time_entry[custom_field_values][9]=${timer.billStatus}&time_entry[spent_on]=${logDate}&time_entry[activity_id]=${getActivityValue(timer.activity)}`;
		window.open(url);
	}

	/**
	 * Checks to see if issue exists in timer data map.
	 * Always returns false if `issue` parameter is empty. 
	 * @param issue Issue string, can be empty.
	 */
	private issueExistsInTimerList(issue: string): TimerData | undefined {
		if (!issue) return;
		const result = this.timerList.find(({ timer }) => timer.issue === issue);
		return result ? result.timer : undefined; 
	}

	private getTimerById(id: TimerId): TimerData {
		for (let i = 0; i < this.timerList.length; ++i) {
			if (this.timerList[i].id === id) {
				return this.timerList[i].timer;
			}
		}

		throw `function getTimerById: Timer doesn't exist with id ${this.timerToConfirm}`;
	}
}

export const TimerSystem = reactive(new _TimerSystem());