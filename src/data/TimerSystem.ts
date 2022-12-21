import TimerInterface from "./TimerInterface";
import { reactive } from "vue";
import format from "date-fns/format";
import HMS from "./HMS";
import { Settings } from "./Settings";
import TimerVue from "../components/Timer.vue";

class _TimerSystem {
    static lastId: number = -1;
    private _map: Map<number, TimerInterface> = new Map();
    private _existingIssues: Map<string, true> = new Map();
    private _activeTimerId: number = NaN;
    private setTimeoutId: number = NaN;
    public timerToConfirm: number = NaN;
    private _favoriteTimers: Map<number, TimerInterface> = new Map();
    private logDate: Date = new Date(); // Does not sync with frontend, but should convienently the same

    public addTimer(ti: TimerInterface) {
        if (this._existingIssues.get(ti.issue)) return;

        this._map.set(this.id(), reactive(ti));
        this._existingIssues.set(ti.issue, true);
        console.log(this._map);
    }

    public map() {
        return this._map;
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
            let drift = Date.now() - expected;
            timer.time!.updateTime(new HMS(0, 0, 1));
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
        const issue = this._map.get(id)!.issue;
        this._map.delete(id);
        this._existingIssues.delete(issue);
        this.timerToConfirm = NaN;
    }

    public editTimer(changes: Partial<TimerInterface>) {
        const timer = this.pullFromMap();
        for (const k of Object.keys(timer)) {
            timer[k] = changes[k] || timer[k];
        }
        this.timerToConfirm = NaN;
    }

    public selectedTimerData() {
        return this._map.get(this.timerToConfirm);
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

    public addFavorite() {
        const id = this.timerToConfirm;
        const timerRef = this._map.get(id)!;
        this._favoriteTimers.set(id, timerRef);
        this.timerToConfirm = NaN;
    }

    public deleteFavorite() {
        this._favoriteTimers.delete(this.timerToConfirm);
        this.timerToConfirm = NaN;
    }

    public favorites() {
        return this._favoriteTimers;
    }

    public resetAllTimers() {
        for (const timer of this._map.values()) {
            timer.time.reset();
        }
    }

    public deleteAllTimers() {
        this._map.clear();
    }

    public logAllTimers() {
        for (const timer of this._map.values()) {
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
        for (const timer of this._map.values()) {
            const hms = new HMS(
                timer.time.hours,
                timer.time.minutes,
                timer.time.seconds
            );
            totalTime.updateTime(hms);
        }

        return totalTime;
    }

    private pullFromMap() {
        const timer = this._map.get(this.timerToConfirm)!;
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
        const workedTime = roundTime(timer.time!);
        const logDate = format(this.logDate, 'dd/MM/yyyy');
        let url = `https://pm.mieweb.com/issues/${timer.issue}/time_entries/new?&time_entry[hours]=${workedTime}&time_entry[comments]=${timer.comment}&time_entry[custom_field_values][9]=${timer.billStatus}&time_entry[spent_on]=${logDate}`;
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